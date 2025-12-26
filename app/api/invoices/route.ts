import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const data = await prisma.invoice.findMany();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      number,
      customerId,
      issuedAt,
      dueAt,
      status,
      total,
      notes,
      createdById,
    } = body;

    // If products are provided, create InvoiceProducts along with the invoice
    const products = Array.isArray(body.products) ? body.products : [];

    // Use a transaction to create invoice and related invoice products atomically
    const newInvoice = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.create({
        data: {
          number,
          customerId,
          issuedAt: new Date(body.issuedAt),
          dueAt: new Date(body.dueAt),
          status,
          total: Number(total),
          notes,
          createdById,
        },
      });

      if (products.length > 0) {
        const createData = products.map((p: any) => ({
          invoiceId: inv.id,
          productId: p.productId,
          quantity: Number(p.quantity),
          unitPrice: Number(p.unitPrice),
          totalPrice: Number(p.totalPrice),
        }));

        await tx.invoiceProduct.createMany({ data: createData });
      }

      // return invoice with its products
      const result = await tx.invoice.findUnique({
        where: { id: inv.id },
        include: { products: true },
      });
      return result;
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
