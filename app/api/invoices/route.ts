import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getInvoices } from "@/features/invoices/db/invoice.query";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";

export async function GET() {
  try {
    const data = await getInvoices();
    const normalized = mapInvoicesToDTO(data);

    return NextResponse.json(normalized, { status: 200 });
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
      products = [],
    } = body;

    // const products = Array.isArray(body.products) ? body.products : [];

    const invoice = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.create({
        data: {
          number,
          customerId,
          issuedAt: new Date(issuedAt),
          dueAt: new Date(dueAt),
          status,
          total: Number(total),
          notes,
          createdById,
        },
      });

      if (products.length) {
        await tx.invoiceProduct.createMany({
          data: products.map((p: any) => ({
            invoiceId: inv.id,
            productId: p.productId,
            quantity: Number(p.quantity),
            unitPrice: Number(p.unitPrice),
            totalPrice: Number(p.totalPrice),
          })),
        });
      }

      return tx.invoice.findUnique({
        where: { id: inv.id },
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
        { error: "Invoice not found after creation" },
        { status: 500 }
      );
    }

    const normalized = mapInvoicesToDTO([invoice])[0];

    return NextResponse.json(normalized, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
