import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await prisma.invoice.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Invoice deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting invoice" },
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

    // Avoid passing relation arrays (like `products`) directly into prisma.update `data`
    const { products, ...rest } = body as any;

    // Use a transaction to update invoice and replace products atomically
    const updated = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.update({
        where: { id },
        data: {
          ...rest,
          issuedAt: new Date(rest.issuedAt),
          dueAt: new Date(rest.dueAt),
          total: Number(rest.total),
        },
      });

      if (Array.isArray(body.products)) {
        // delete existing products
        await tx.invoiceProduct.deleteMany({ where: { invoiceId: id } });

        const productsToCreate = body.products.map((p: any) => ({
          invoiceId: id,
          productId: p.productId,
          quantity: Number(p.quantity),
          unitPrice: Number(p.unitPrice),
          totalPrice: Number(p.totalPrice),
        }));

        if (productsToCreate.length > 0) {
          await tx.invoiceProduct.createMany({ data: productsToCreate });
        }
      }

      return tx.invoice.findUnique({
        where: { id },
        include: { products: true },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating invoice" },
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
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching invoice" },
      { status: 500 }
    );
  }
}
