"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema } from "@/schemas/invoice";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInvoices } from "@/hooks/use-invoices";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { InvoiceType } from "@/lib/types/custom-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar";
import { cn, getInvoiceStatusList } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Customer,
  InvoiceStatus,
  User,
} from "@/app/generated/prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceProductForm, { SelectedItem } from "./invoice-product-form";
import { useEffect } from "react";
import { Label } from "../ui/label";
import { authClient } from "@/lib/auth/auth-client";

export default function InvoiceForm({
  setIsOpen,
  invoice,
  mode,
  customers,
}: // users,
{
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  invoice?: InvoiceType | undefined;
  mode: "create" | "edit";
  customers: Customer[];
  // users: User[];
}) {
  const {
    createInvoice,
    updateInvoice,
    createInvoiceWithRevalidate,
    updateInvoiceWithRevalidate,
    isLoading,
  } = useInvoices();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const statusList = getInvoiceStatusList();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      number: invoice?.number || "",
      notes: invoice?.notes || "",
      customerId: invoice?.customerId || "",
      createdById: invoice?.createdById || session?.user.id,
      issuedAt: invoice?.issuedAt || new Date(),
      dueAt: invoice?.dueAt || new Date(),
      total: invoice?.totalAsNumber.toString() || "",
      status: invoice?.status || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    // attach products from items
    const payload: any = {
      ...values,
      products: items.map((it) => ({
        productId: (it.product as any).id,
        quantity: it.quantity,
        unitPrice: it.price,
        totalPrice: it.price * it.quantity,
      })),
    };

    if (mode === "create") {
      const promise = createInvoiceWithRevalidate(payload);
      toast.promise(promise, {
        loading: "Creating invoice and revalidating...",
        success: "Invoice created and table updated",
        error: "Failed to create invoice",
      });

      try {
        await promise;
        form.reset();
        router.refresh();
        setIsOpen(false);
      } catch (err) {
        // error already shown via toast
      }
    } else {
      if (invoice) {
        const promise = updateInvoiceWithRevalidate({
          id: invoice?.id,
          data: payload,
        });
        toast.promise(promise, {
          loading: "Updating invoice and revalidating...",
          success: "Invoice updated and table updated",
          error: "Failed to update invoice",
        });

        try {
          await promise;
          form.reset();
          router.refresh();
          setIsOpen(false);
        } catch (err) {}
      }
    }
  }

  // product items state and syncing total
  const [items, setItems] = useState<SelectedItem[]>(() => {
    // try to initialize from invoice if it has products
    const invAny = invoice as any;
    if (invAny && Array.isArray(invAny.products)) {
      return invAny.products.map((p: any) => {
        // case A: pivot row with nested product ({ product: {...}, quantity, unitPrice })
        if (p.product) {
          return {
            product: p.product,
            price: Number(p.unitPrice ?? p.product.price ?? 0),
            quantity: Number(p.quantity ?? 1),
          } as SelectedItem;
        }

        // case B: pivot row without nested product but with productId
        if (p.productId) {
          return {
            product: { id: p.productId, name: p.name ?? "" } as any,
            price: Number(p.unitPrice ?? p.price ?? 0),
            quantity: Number(p.quantity ?? 1),
          } as SelectedItem;
        }

        // case C: already-mapped product object (from page mapping)
        return {
          product: {
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.unitPrice ?? p.price ?? 0,
            unit: p.unit,
          } as any,
          price: Number(p.unitPrice ?? p.price ?? 0),
          quantity: Number(p.quantity ?? 1),
        } as SelectedItem;
      });
    }
    return [];
  });

  useEffect(() => {
    const total = items.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.quantity),
      0
    );
    form.setValue("total", String(total));
  }, [items, form]);

  return (
    <ScrollArea className="pt-4 h-[75vh] pr-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          {/* <Tabs defaultValue="invoiceData" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="invoiceData">Invoice Data</TabsTrigger>
              <TabsTrigger value="invoiceProducts">
                Invoice Products
              </TabsTrigger>
            </TabsList>
            <TabsContent value="invoiceData" className="grid grid-cols-2 gap-8"> */}
          <div className="grid grid-cols-2 gap-4 gap-y-8">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Invoice number..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none h-20"
                        placeholder="notes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="issuedAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Issued Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </>
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : new Date()
                        }
                        onSelect={field.onChange}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : new Date()
                        }
                        onSelect={field.onChange}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {customers && customers.length > 0 ? (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <Loader className="animate-spin" />
              </>
            )}
            {/* {users && users.length > 0 ? (
              <FormField
                control={form.control}
                name="createdById"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created By</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <Loader className="animate-spin" />
              </>
            )} */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusList.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <div className="col-span-2 space-y-2">
              <Label>Products</Label>
              <InvoiceProductForm initialItems={items} onChange={setItems} />
            </div>
            <div className="col-span-2 w-1/2 ml-auto">
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        type="number"
                        step={10}
                        placeholder="total..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* </TabsContent>
            <TabsContent value="invoiceProducts"></TabsContent>
          </Tabs> */}
          <Button
            type="submit"
            disabled={isLoading || !customers}
            size="lg"
            className="w-fit cursor-pointer my-4 ml-auto col-span-2"
          >
            {isLoading || !customers ? (
              <>
                <Loader className="animate-spin" /> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
