"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from "@/components/forms/product-form";
import { useState } from "react";
import { ProductType } from "@/lib/types/custom-types";

export default function ProductCU({
  product = undefined,
  mode = "create",
  trigger,
}: {
  product?: ProductType | undefined;
  mode?: "create" | "edit";
  trigger?: React.ReactNode; // custom trigger (Edit button)
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer">
            <Plus /> Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {mode === "create" ? "Add Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new product."
              : "Update this product and save your changes."}
          </DialogDescription>
        </DialogHeader>
        <ProductForm setIsOpen={setIsOpen} product={product} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
