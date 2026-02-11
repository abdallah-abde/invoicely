"use client";

import { Button } from "@/components/ui/button";
import { Plus, SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from "@/features/products/components/product-form";
import { useState } from "react";
import { ProductType } from "@/features/products/product.types";
import { useTranslations } from "next-intl";
import { useIsMutating } from "@tanstack/react-query";
import { OperationMode } from "@/features/shared/shared.types";

export default function ProductCU({
  product = undefined,
  mode = OperationMode.CREATE,
}: {
  product?: ProductType | undefined;
  mode?: OperationMode;
}) {
  const isOperationCreate = mode === OperationMode.CREATE;
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const isMutating =
    useIsMutating({
      mutationKey: ["cusomters"],
    }) > 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!isMutating) setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        {!isOperationCreate ? (
          <Button
            className="cursor-pointer text-xs sm:text-sm p-2 w-full justify-start group"
            variant="secondary"
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
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          if (!isMutating) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!isMutating) e.preventDefault();
        }}
      >
        <>
          {/* {isMutating && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          )} */}

          <DialogHeader>
            <DialogTitle>
              {isOperationCreate
                ? t("products.add-description")
                : t("products.edit")}
            </DialogTitle>
          </DialogHeader>
          <ProductForm setIsOpen={setIsOpen} product={product} mode={mode} />
        </>
      </DialogContent>
    </Dialog>
  );
}
