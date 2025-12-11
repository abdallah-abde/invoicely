import PageHeader from "@/components/page-header";
import prisma from "@/lib/prisma";
import InvoiceForm from "@/components/forms/invoice-form";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
    },
    include: {
      customer: true,
      createdBy: true,
      _count: {
        select: {
          products: true,
        },
      },
      // include the related product for each invoice-product pivot row
      products: {
        include: {
          product: true,
        },
      },
    },
  });
  const customers = await prisma.customer.findMany();
  const users = await prisma.user.findMany();

  let invoiceObj;

  if (invoice) {
    const createdDate = invoice.createdAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const issuedDate = invoice.issuedAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const dueDate = invoice.dueAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const { total, ...invoiceWithoutTotal } = invoice;

    // map invoice-product pivot rows into the expected product shape
    const products = invoice.products.map((ip) => ({
      // spread the actual product fields first (name, id, createdAt, updatedAt, description, price, unit, ...)
      ...(ip.product ?? {}),
      // add invoice-specific fields if needed
      quantity: ip.quantity,
      unitPrice: ip.unitPrice,
      totalPrice: ip.totalPrice,
      // keep pivot ids if you need them later
      id: ip.product ? ip.product.id : ip.id,
    }));

    invoiceObj = {
      ...invoiceWithoutTotal,
      createdAt: createdDate,
      issuedDateAsString: issuedDate,
      dueDateAsString: dueDate,
      totalAsNumber: total.toNumber(),
      products,
    };
  }

  return (
    <div>
      <PageHeader title="Edit Invoice">
        <></>
      </PageHeader>
      <InvoiceForm
        // setIsOpen={setIsOpen}
        invoice={invoiceObj}
        mode={"edit"}
        customers={customers}
        users={users}
      />
    </div>
  );
}
