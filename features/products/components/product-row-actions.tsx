import { useState } from "react";
import { ProductType } from "@/features/products/product.types";
import { useProducts } from "@/features/products/hooks/use-products";
import { useRole } from "@/hooks/use-role";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import ProductCU from "@/features/products/components/product-cu";
import { OperationMode } from "@/features/shared/shared.types";

export function ProductRowActions({ product }: { product: ProductType }) {
  const [isOpen, setIsOpen] = useState(false);

  const { deleteProduct, isDeleting } = useProducts();
  const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

  if (isRoleUser || isRoleModerator) return null;

  return (
    <DataTableActions
      editTrigger={<ProductCU mode={OperationMode.UPDATE} product={product} />}
      isDeleting={isDeleting}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      showDelete={isRoleSuperAdmin}
      onDelete={async () => {
        setIsOpen(false);
        await deleteProduct.mutateAsync(product.id);
      }}
      resource="product"
    />
  );
}
