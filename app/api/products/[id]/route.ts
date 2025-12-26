import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await prisma.product.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...body,
        price: Number(body.price),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}
