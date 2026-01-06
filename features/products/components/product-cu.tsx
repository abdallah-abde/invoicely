"use client";

import { Button } from "@/components/ui/button";
import { Plus, SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from "@/features/products/components/product-form";
import { useState } from "react";
import { ProductType } from "@/features/products/product.types";
import { useTranslations } from "next-intl";

export default function ProductCU({
  product = undefined,
  mode = "create",
}: {
  product?: ProductType | undefined;
  mode?: "create" | "edit";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button
            className="cursor-pointer text-xs sm:text-sm p-2 w-full justify-start group"
            variant="outline"
          >
            <SquarePen className="group-hover:text-primary transition-colors duration-300" />
            {t("Labels.edit")}
          </Button>
        ) : (
          <Button className="cursor-pointer text-xs sm:text-sm">
            <Plus />{" "}
            <span className="hidden sm:block">{t("products.add")}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {mode === "create"
              ? t("products.add-description")
              : t("products.edit")}
          </DialogTitle>
          {/* <DialogDescription>
            {mode === "create"
              ? t("products.add-description")
              : t("products.edit-description")}
          </DialogDescription> */}
        </DialogHeader>
        <ProductForm setIsOpen={setIsOpen} product={product} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
