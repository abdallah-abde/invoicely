import { Product } from "@/app/generated/prisma/client";
import z from "zod";
import { productSchema } from "./schemas/product.schema";

export interface ProductType extends Omit<Omit<Product, "price">, "createdAt"> {
  _count: {
    invoices: number;
  };
  priceAsNumber: number;
  price: undefined;
}

/*** PRODUCT NORMALIZE TYPES ***/
export interface ProductPrismaPayload extends Product {
  _count: { invoices: number };
}

/* ---------- INPUT TYPES ---------- */

export type ProductInput = z.infer<typeof productSchema>;

/* ---------- RESPONSE TYPES ---------- */

export type ProductResponse = Product;
