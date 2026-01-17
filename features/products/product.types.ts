import { Product } from "@/app/generated/prisma/client";

export interface ProductType extends Omit<Omit<Product, "price">, "createdAt"> {
  _count: {
    invoices: number;
  };
  priceAsNumber: number;
  price: undefined;
}
