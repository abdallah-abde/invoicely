import {
  deleteProduct,
  updateProduct,
} from "@/features/products/db/product.mutation";
import { getProductById } from "@/features/products/db/product.query";
import { mapProductsToDTO } from "@/features/products/lib/product.normalize";
import { productSchema } from "@/features/products/schemas/product.schema";
import { notFound, serverError } from "@/lib/api/api-response";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteProduct(id);

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    return serverError("validation.failed-to-delete-product");
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = productSchema.parse(await req.json());

    const product = await updateProduct(id, body);

    if (!product) {
      return notFound("validation.product-not-found-after-update");
    }

    return NextResponse.json(mapProductsToDTO([product])[0], { status: 200 });
  } catch (error) {
    return serverError("validation.failed-to-update-product");
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await getProductById(id);

    if (!product) {
      return serverError("validation.product-not-found");
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(error);
    return serverError("validation.failed-to-get-product");
  }
}
