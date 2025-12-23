"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InvoiceForm from "@/components/forms/invoice-form";
import { useEffect, useState } from "react";
import { InvoiceType } from "@/lib/types/custom-types";

export default function InvoiceCU({
  invoice = undefined,
  mode = "create",
  trigger,
}: {
  invoice?: InvoiceType | undefined;
  mode?: "create" | "edit";
  trigger?: React.ReactNode; // custom trigger (Edit button)
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  // const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchCustomers();
    // fetchUsers();

    async function fetchCustomers() {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    }

    // async function fetchUsers() {
    //   const res = await fetch("/api/users");
    //   const data = await res.json();
    //   setUsers(data);
    // }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer">
            <Plus /> Add Invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[925px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {mode === "create" ? "Add Invoice" : "Edit Invoice"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new invoice."
              : "Update this invoice and save your changes."}
          </DialogDescription>
        </DialogHeader>
        <InvoiceForm
          setIsOpen={setIsOpen}
          invoice={invoice}
          mode={mode}
          customers={customers}
          // users={users}
        />
      </DialogContent>
    </Dialog>
  );
}
