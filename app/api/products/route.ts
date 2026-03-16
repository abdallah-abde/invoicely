import { NextResponse } from "next/server";
import { getProducts } from "@/features/products/db/product.query";
import {
  mapProductsToDTO,
  mapSingleProductToDTO,
} from "@/features/products/lib/product.normalize";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { productSchema } from "@/features/products/schemas/product.schema";
import { createProduct } from "@/features/products/db/product.mutation";
import { DomainError } from "@/lib/errors/domain-error";

export async function GET() {
  try {
    const data = await getProducts();

    return NextResponse.json(mapProductsToDTO(data), { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-products");
  }
}

export async function POST(req: Request) {
  try {
    const body = productSchema.parse(await req.json());

    const product = await createProduct(body);

    if (!product) {
      return notFound("validation.product-not-found");
    }

    return NextResponse.json(mapSingleProductToDTO(product), { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-create-product");
  }
}
