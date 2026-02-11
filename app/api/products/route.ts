import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getProducts } from "@/features/products/db/product.query";
import { mapProductsToDTO } from "@/features/products/lib/product.normalize";
import { serverError } from "@/lib/api/api-response";
import { productSchema } from "@/features/products/schemas/product.schema";
import { createProduct } from "@/features/products/db/product.mutation";

export async function GET() {
  try {
    const data = await getProducts();
    const normalized = mapProductsToDTO(data);

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    console.error(err);
    return serverError("validation.failed-to-get-products");
  }
}

export async function POST(request: Request) {
  try {
    const body = productSchema.parse(await request.json());

    const product = await createProduct(body);

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return serverError("validation.failed-to-create-product");
  }
}
