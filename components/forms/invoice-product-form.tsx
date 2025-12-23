"use client";

import { useEffect, useState } from "react";

import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Loader, Trash2 } from "lucide-react";
import type { Product } from "@/app/generated/prisma/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export type SelectedItem = {
  product: Product;
  price: number;
  quantity: number;
};

interface InvoiceProductFormProps {
  /** For edit mode: pre-populate rows */
  initialItems?: SelectedItem[];
  /** Called when selected items change (add/remove/update price/qty) */
  onChange?: (items: SelectedItem[]) => void;
}

export default function InvoiceProductForm({
  initialItems = [],
  onChange,
}: InvoiceProductFormProps) {
  const [isTriggered, setIsTriggered] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  // map of productId -> Product (string keys)
  const [productsMap, setProductsMap] = useState<Record<string, Product>>({});

  // selected options shown in MultipleSelector (controlled)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  // rows rendered below selector
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      // populate selected items and options from initialItems
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
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChange?.(selectedItems);
  }, [selectedItems, onChange]);

  // The search endpoint returns Option[] ({ label, value })
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
    // sync selectedOptions
    setSelectedOptions(opts);

    const ids = opts.map((o) => String(o.value));

    // keep existing items that are still selected
    const kept = selectedItems.filter((it) =>
      ids.includes(String((it.product as any).id))
    );

    // find newly added ids
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
          continue; // skip if product not found
        }
      }
      addedItems.push({
        product: prod,
        price: (prod as any).price ?? 0,
        quantity: 1,
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
      // also remove from selectedOptions so UI deselects badge
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
        placeholder="Select products..."
        loadingIndicator={
          <p className="w-full flex items-center gap-2 p-2 text-center text-lg leading-10 text-muted-foreground">
            <Loader className="animate-spin ml-auto" />{" "}
            <span className="mr-auto">Loading Products...</span>
          </p>
        }
        emptyIndicator={
          <p className="w-full text-center text-lg leading-10 text-muted-foreground">
            No results found.
          </p>
        }
        onChange={(opts) => {
          void handleSelectionChange(opts);
        }}
      />

      {selectedItems.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedItems.map((it, idx) => (
            <div
              key={String((it.product as any).id)}
              className="flex items-center gap-2"
            >
              <div className="flex-1">{it.product.name}</div>
              <div className="w-28">
                <label className="sr-only">Price</label>
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
              <div className="w-24">
                <label className="sr-only">Quantity</label>
                <Input
                  type="number"
                  className="input"
                  value={it.quantity}
                  onChange={(e) =>
                    updateItem(idx, { quantity: Number(e.target.value) })
                  }
                />
              </div>
              <Button
                type="button"
                onClick={() => removeItem(idx)}
                size="icon"
                className="cursor-pointer"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
