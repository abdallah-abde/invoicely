import PageHeader from "@/components/page-header";
import prisma from "@/lib/prisma";
import InvoiceCU from "../invoice-cu";
import InvoiceForm from "@/components/forms/invoice-form";

export default async function page() {
  const customers = await prisma.customer.findMany();
  const users = await prisma.user.findMany();

  return (
    <div>
      <PageHeader title="Add Invoice">
        <></>
      </PageHeader>
      <InvoiceForm
        // setIsOpen={setIsOpen}
        invoice={undefined}
        mode={"create"}
        customers={customers}
        users={users}
      />
    </div>
  );
}
