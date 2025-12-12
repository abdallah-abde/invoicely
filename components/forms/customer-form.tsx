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
import { customerSchema } from "@/schemas/customer";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCustomers } from "@/hooks/use-customers";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import type { Customer } from "@/app/generated/prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CustomerForm({
  setIsOpen,
  customer,
  mode,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  customer?: Customer | undefined;
  mode: "create" | "edit";
}) {
  const { createCustomer, updateCustomer, isLoading } = useCustomers();
  const router = useRouter();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      companyName: customer?.companyName || "",
      address: customer?.address || "",
      phone: customer?.phone || "",
      taxNumber: customer?.taxNumber || "",
    },
  });

  function onSubmit(values: z.infer<typeof customerSchema>) {
    if (mode === "create") {
      createCustomer.mutate(values, {
        onSuccess: () => {
          // optional UI refresh
          form.reset();
          router.refresh();
          setIsOpen(false);
          toast.success("Customer created successfully!");
        },
      });
    } else {
      if (customer) {
        updateCustomer.mutate(
          { id: customer?.id, data: values },
          {
            onSuccess: () => {
              // optional UI refresh
              form.reset();
              router.refresh();
              toast.success("Customer updated successfully!");
              setIsOpen(false);
            },
          }
        );
      }
    }
  }

  return (
    <ScrollArea className="h-[75vh] px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 grid grid-cols-2 gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="phone..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="address..."
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
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="company..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Number</FormLabel>
                <FormControl>
                  <Input placeholder="Tax Number..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-fit cursor-pointer"
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
