import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getProducts } from "@/features/products/db/product.query";
import { mapProductsToDTO } from "@/features/products/lib/product.normalize";

export async function GET() {
  try {
    const data = await getProducts();
    const normalized = mapProductsToDTO(data);

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newProduct = await prisma.product.create({
      data: {
        ...body,
        price: Number(body.price),
      },
    });

    const { price, ...rest } = newProduct;

    return NextResponse.json(
      { ...rest, priceAsNumber: Number(price) },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
