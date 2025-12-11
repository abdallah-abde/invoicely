import { Product } from "@/app/generated/prisma/client";
import { castProductsToOptions } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { value: string } }
) {
  try {
    const { value } = await params;
    const products: Product[] = await prisma.product.findMany({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json(
      products.map((pro) => ({ label: pro.name, value: pro.id })),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get products" },
      { status: 500 }
    );
  }
}
