"use client";

import { useEffect, useState } from "react";

import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Loader, Trash2 } from "lucide-react";
import type { Product } from "@/app/generated/prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useArabic } from "@/hooks/use-arabic";
import { localizeArabicCurrencySymbol } from "@/lib/utils/number.utils";

export type SelectedItem = {
  product: Product;
  price: number;
  quantity: number;
  unit: string;
};

interface InvoiceProductFormProps {
  initialItems?: SelectedItem[];
  onChange?: (items: SelectedItem[]) => void;
}

export default function InvoiceProductForm({
  initialItems = [],
  onChange,
}: InvoiceProductFormProps) {
  const [isTriggered, setIsTriggered] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [productsMap, setProductsMap] = useState<Record<string, Product>>({});

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const t = useTranslations();
  const isArabic = useArabic();

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      const initialOpts: Option[] = initialItems.map((it) => ({
        value: String((it.product as any).id),
        label: it.product.name || String((it.product as any).id),
      }));

      const map: Record<string, Product> = {};
      initialItems.forEach((it) => {
        map[String((it.product as any).id)] = it.product;
      });

      setProductsMap((prev) => ({ ...prev, ...map }));
      setSelectedOptions(initialOpts);
      setSelectedItems(
        initialItems.map((it) => ({
          product: it.product,
          price: it.price ?? (it.product as any).price ?? 0,
          quantity: it.quantity ?? 1,
          unit: it.unit ?? "",
        }))
      );
    }
  }, []);

  useEffect(() => {
    onChange?.(selectedItems);
  }, [selectedItems, onChange]);

  const handleSearch = async (value: string) => {
    setIsTriggered(true);
    try {
      const res = await fetch(
        `/api/products/search/${encodeURIComponent(value)}`
      );
      if (!res.ok) return [] as Option[];
      const data = (await res.json()) as Option[];
      setOptions(data);
      return data;
    } finally {
      setIsTriggered(false);
    }
  };

  const fetchProductById = async (id: string) => {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return (await res.json()) as Product;
  };

  const handleSelectionChange = async (opts: Option[]) => {
    setSelectedOptions(opts);

    const ids = opts.map((o) => String(o.value));

    const kept = selectedItems.filter((it) =>
      ids.includes(String((it.product as any).id))
    );

    const keptIds = new Set(kept.map((it) => String((it.product as any).id)));
    const addedIds = ids.filter((id) => !keptIds.has(id));

    const addedItems: SelectedItem[] = [];

    for (const id of addedIds) {
      let prod = productsMap[id];
      if (!prod) {
        const fetchedProd = await fetchProductById(id);
        if (fetchedProd) {
          prod = fetchedProd;
        } else {
          continue;
        }
      }
      addedItems.push({
        product: prod,
        price: (prod as any).price ?? 0,
        quantity: 1,
        unit: "",
      });
    }

    const newItems = [...kept, ...addedItems];
    setSelectedItems(newItems);
  };

  const updateItem = (
    index: number,
    data: Partial<{ price: number; quantity: number }>
  ) => {
    setSelectedItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...data } as SelectedItem;
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setSelectedItems((prev) => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      setSelectedOptions((prevOpts) =>
        prevOpts.filter((o) => o.value !== String((removed.product as any).id))
      );
      return copy;
    });
  };

  return (
    <>
      <MultipleSelector
        className="w-full"
        value={selectedOptions}
        options={options}
        hidePlaceholderWhenSelected
        hideClearAllButton
        onSearch={async (value) => {
          return await handleSearch(value);
        }}
        placeholder={t("Fields.products.placeholder")}
        loadingIndicator={
          <p className="w-full flex items-center gap-2 p-2 text-center text-lg leading-10 text-muted-foreground">
            <Loader className="animate-spin ms-auto" />{" "}
            <span className="me-auto">{t("Fields.products.loading")}</span>
          </p>
        }
        emptyIndicator={
          <p className="w-full text-center text-lg leading-10 text-muted-foreground">
            {t("Labels.no-results")}
          </p>
        }
        onChange={(opts) => {
          void handleSelectionChange(opts);
        }}
      />

      {selectedItems.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2 border-b">
              <div className="flex-1">{t("Fields.name.label")}</div>
              <div className="w-28 text-center">
                {t("Fields.price.label", {
                  currency: localizeArabicCurrencySymbol(isArabic),
                })}
              </div>
              <div className="w-28 text-center me-2">
                {t("Fields.quantity.label")}
              </div>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent dark:hover:bg-transparent"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          )}
          {selectedItems.map((it, idx) => {
            return (
              <div
                key={String((it.product as any).id)}
                className="flex items-center gap-2"
              >
                <div className="flex-1">{it.product.name}</div>
                <div className="w-28">
                  <Label className="sr-only">
                    {t("Fields.price.label", {
                      currency: localizeArabicCurrencySymbol(isArabic),
                    })}
                  </Label>
                  <Input
                    type="number"
                    className="input"
                    value={it.price}
                    step={10}
                    onChange={(e) =>
                      updateItem(idx, { price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="w-28 flex items-center gap-2 me-2">
                  <Label className="sr-only">
                    {t("Fields.quantity.label")}
                  </Label>
                  <Input
                    type="number"
                    className="input"
                    value={it.quantity}
                    onChange={(e) =>
                      updateItem(idx, { quantity: Number(e.target.value) })
                    }
                  />
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {it.product.unit}
                  </Badge>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => removeItem(idx)}
                      size="icon"
                      className="cursor-pointer"
                    >
                      <Trash2 />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    {t("Labels.remove-product")}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
