import { Product } from "@/app/generated/prisma/client";
import { Option } from "@/components/ui/multiple-selector";

export function castProductsToOptions(products: Product[]) {
  return products.map((prod) => {
    const option: Option = {
      label: prod.name,
      value: prod.id,
    };
    return option;
  });
}
