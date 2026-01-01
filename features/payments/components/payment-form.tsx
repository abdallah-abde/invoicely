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
import { paymentSchema } from "@/features/payments/schemas/payment.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { PaymentType } from "@/features/payments/payment.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Invoice, Payment } from "@/app/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getPaymentMethodList } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/features/auth/services/access";

export type SelectedItem = {
  invoice: Invoice;
};

export default function PaymentForm({
  setIsOpen,
  payment,
  mode,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  payment?: PaymentType | undefined;
  mode: "create" | "edit";
}) {
  const { createPayment, updatePayment, isLoading } = usePayments();
  const router = useRouter();

  const methodList = getPaymentMethodList();

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: [
        {
          label: payment?.invoice.number || undefined,
          value: payment?.invoiceId || undefined,
          disable: false,
        },
      ],
      amount: payment?.amountAsNumber.toString() || "",
      date: payment?.date || new Date(),
      method: payment?.method || undefined,
      notes: payment?.notes || "",
    },
  });

  async function onSubmit(values: z.infer<typeof paymentSchema>) {
    if (mode === "create") {
      const hasCreatePermission = await hasPermission({
        resource: "payment",
        permission: ["create"],
      });

      if (hasCreatePermission) {
        createPayment.mutate(values, {
          onSuccess: () => {
            form.reset();
            router.refresh();
            setIsOpen(false);
            toast.success("Payment created successfully!");
          },
        });
      } else {
        toast.error("You do not have permission to create payments.");
      }
    } else {
      if (payment) {
        const hasUpdatePermission = await hasPermission({
          resource: "payment",
          permission: ["update"],
        });

        if (hasUpdatePermission) {
          updatePayment.mutate(
            { id: payment?.id, data: values },
            {
              onSuccess: () => {
                // optional UI refresh
                form.reset();
                router.refresh();
                toast.success("Payment updated successfully!");
                setIsOpen(false);
              },
            }
          );
        } else {
          toast.error("You do not have permission to update payments.");
        }
      }
    }
  }

  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    mode === "edit"
      ? [
          {
            label: payment?.invoice.number || "",
            value: payment?.invoiceId || "",
          },
        ]
      : []
  );
  const [options, setOptions] = useState<Option[]>();
  const [isTriggered, setIsTriggered] = useState(false);
  // const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [prevPayments, setPrevPayments] = useState<number | null>(null);
  const [invoiceTotal, setInvoiceTotal] = useState<number | null>(null);
  const [isNumbersLoading, setIsNumbersLoading] = useState(false);

  // Watch invoiceId from the form and fetch invoice total + previous payments when it changes.
  const invoiceId = form.watch("invoiceId");

  useEffect(() => {
    let mounted = true;
    if (!invoiceId) {
      setPrevPayments(null);
      setInvoiceTotal(null);
      return;
    }

    setIsNumbersLoading(true);
    setPrevPayments(null);
    setInvoiceTotal(null);

    (async () => {
      try {
        const [invoiceRes, paymentsRes] = await Promise.all([
          fetch(`/api/invoices/${encodeURIComponent(invoiceId[0].value)}`),
          fetch(
            `/api/payments/invoice/${encodeURIComponent(invoiceId[0].value)}`
          ),
        ]);

        if (!mounted) return;

        if (invoiceRes.ok) {
          const invoiceData = (await invoiceRes.json()) as Invoice;
          setInvoiceTotal(Number(invoiceData.total ?? 0));
        }

        if (paymentsRes.ok) {
          const paymentsData = (await paymentsRes.json()) as Payment[];
          setPrevPayments(
            paymentsData.reduce((acc, item) => Number(item.amount) + acc, 0)
          );
        }
      } catch (e) {
        console.error("Error fetching invoice numbers:", e);
      } finally {
        if (mounted) setIsNumbersLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [invoiceId]);

  useEffect(() => {
    if (mode === "edit" && selectedOptions && selectedOptions.length > 0)
      onselectionchange(selectedOptions);
  }, []);

  const handleSearch = async (value: string) => {
    setIsTriggered(true);
    try {
      const res = await fetch(
        `/api/invoices/search/${encodeURIComponent(value)}`
      );
      if (!res.ok) return [] as Option[];
      const data = (await res.json()) as Option[];
      setOptions(data);
      return data;
    } finally {
      setIsTriggered(false);
    }
  };

  const onselectionchange = async (opts: Option[]) => {
    setIsNumbersLoading(true);
    setPrevPayments(null);
    setInvoiceTotal(null);
    // setSelectedOptions(opts);

    try {
      const [invoice, payments] = await Promise.all([
        await fetch(`/api/invoices/${opts[0].value}`),
        await fetch(`/api/payments/invoice/${opts[0].value}`),
      ]);

      const [invoiceData, paymentsData] = await Promise.all([
        await invoice.json(),
        await payments.json(),
      ]);

      // console.log("invoiceData", invoiceData);
      // console.log("paymentsData", paymentsData);

      setPrevPayments(
        (paymentsData as Payment[]).reduce(
          (acc, item) => Number(item.amount) + acc,
          0
        )
      );
      setInvoiceTotal(Number((invoiceData as Invoice).total));
    } catch (error) {
      console.log(error);
    } finally {
      setIsNumbersLoading(false);
    }
  };

  return (
    <ScrollArea className="h-[75vh] px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 grid grid-cols-1 gap-2"
        >
          <FormField
            control={form.control}
            name="invoiceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    className="w-full"
                    value={selectedOptions}
                    options={options}
                    hidePlaceholderWhenSelected
                    hideClearAllButton
                    disabled={mode === "edit"}
                    onSearch={async (value) => {
                      return await handleSearch(value);
                    }}
                    placeholder="Select invoices..."
                    loadingIndicator={
                      <p className="w-full flex items-center gap-2 p-2 text-center text-lg leading-10 text-muted-foreground">
                        <Loader className="animate-spin ml-auto" />{" "}
                        <span className="mr-auto">Loading Invoices...</span>
                      </p>
                    }
                    emptyIndicator={
                      <p className="w-full text-center text-lg leading-10 text-muted-foreground">
                        No results found.
                      </p>
                    }
                    // onChange={(opts) => onselectionchange(opts)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none h-20"
                    placeholder="Enter payment notes..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {methodList.map((item) => (
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
          {prevPayments !== null && invoiceTotal !== null ? (
            <div className="flex items-center justify-between text-sm border p-2 rounded-md">
              <p>
                Invoice Total:{" "}
                <Badge
                  variant="secondary"
                  className="text-[15px] ml-1 bg-primary"
                >
                  {invoiceTotal}
                </Badge>
              </p>
              <p>
                Invoice rest:{" "}
                <Badge variant="destructive" className="text-[15px] ml-1">
                  {invoiceTotal - prevPayments}
                </Badge>
              </p>
            </div>
          ) : isNumbersLoading ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin" />{" "}
              <span className="animate-pulse">Loading total & rest</span>
            </div>
          ) : null}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={10}
                    placeholder="Payment amount..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Invoice Date</FormLabel>
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
          <Button
            type="submit"
            disabled={isLoading || isTriggered || isNumbersLoading}
            size="lg"
            className="w-fit cursor-pointer ml-auto"
          >
            {isLoading ? (
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
