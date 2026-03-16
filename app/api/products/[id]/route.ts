import {
  deleteProduct,
  updateProduct,
} from "@/features/products/db/product.mutation";
import { getProductById } from "@/features/products/db/product.query";
import { mapSingleProductToDTO } from "@/features/products/lib/product.normalize";
import { productSchema } from "@/features/products/schemas/product.schema";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await deleteProduct(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
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

    return NextResponse.json(mapSingleProductToDTO(product), { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-update-product");
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await getProductById(id);

    if (!product) {
      return notFound("validation.product-not-found");
    }

    return NextResponse.json(mapSingleProductToDTO(product), { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-product");
  }
}
