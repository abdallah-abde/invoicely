import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";

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

    const { products, ...rest } = body as any;

    const invoice = await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id },
        data: {
          ...rest,
          issuedAt: new Date(rest.issuedAt),
          dueAt: new Date(rest.dueAt),
          total: Number(rest.total),
        },
      });

      if (Array.isArray(body.products)) {
        await tx.invoiceProduct.deleteMany({ where: { invoiceId: id } });

        if (products.length > 0) {
          await tx.invoiceProduct.createMany({
            data: body.products.map((p: any) => ({
              invoiceId: id,
              productId: p.productId,
              quantity: Number(p.quantity),
              unitPrice: Number(p.unitPrice),
              totalPrice: Number(p.totalPrice),
            })),
          });
        }
      }

      return tx.invoice.findUnique({
        where: { id },
        include: {
          customer: true,
          createdBy: true,
          products: {
            include: {
              product: true,
            },
          },
          _count: {
            select: { products: true },
          },
        },
      });
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found after update" },
        { status: 404 }
      );
    }

    const normalized = mapInvoicesToDTO([invoice])[0];

    return NextResponse.json(normalized, { status: 200 });
  } catch (error) {
    console.error(error);
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
