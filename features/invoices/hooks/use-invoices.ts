import { useTranslations } from "next-intl";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchInvoices } from "../api/invoice.api";
import { ZodError } from "zod";
import { translateZodError } from "@/lib/utils/zod-intl";
import { InvoiceType } from "../invoice.types";
// import { toast } from "sonner";

export function useInvoices() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createInvoice = useMutation({
    mutationKey: ["invoices"],

    mutationFn: async (data: any) => {
      setFieldErrors({});

      const res = await fetch("/api/invoices", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },

    onMutate: async (newInvoice) => {
      await queryClient.cancelQueries({ queryKey: ["invoices"] });

      const previous = queryClient.getQueryData<InvoiceType[]>(["invoices"]);

      queryClient.setQueryData<InvoiceType[]>(["invoices"], (old = []) => {
        return [
          ...old,
          {
            ...newInvoice,
            id: "temp-id",
            issuedDateAsString: "",
            dueDateAsString: "",
            totalAsNumber: Number(newInvoice.total),
            _count: { products: 0 },
            products: [],
            customer: { name: "" },
            createdBy: { name: "" },
          },
        ];
      });

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["invoices"], context.previous);
      }

      if (error?.error === "VALIDATION_ERROR") {
        const translated = translateZodError(
          { issues: error.issues } as ZodError,
          t
        );

        setFieldErrors(
          translated.reduce(
            (acc, curr) => {
              acc[curr.path] = curr.message;
              return acc;
            },
            {} as Record<string, string>
          )
        );
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  const updateInvoice = useMutation({
    mutationKey: ["invoices"],

    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setFieldErrors({});

      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["invoices"] });

      const previous = queryClient.getQueryData<InvoiceType[]>(["invoices"]);

      queryClient.setQueryData<InvoiceType[]>(["invoices"], (old = []) =>
        old.map((invoice) =>
          invoice.id === id
            ? {
                ...invoice,
                ...data,
                issuedDateAsString: "",
                dueDateAsString: "",
                totalAsNumber: Number(data.total),
                _count: { products: 0 },
                products: [],
                customer: { name: "" },
                createdBy: { name: "" },
              }
            : invoice
        )
      );

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["invoices"], context.previous);
      }
      if (error?.error === "VALIDATION_ERROR") {
        const translated = translateZodError(
          { issues: error.issues } as ZodError,
          t
        );

        setFieldErrors(
          translated.reduce(
            (acc, curr) => {
              acc[curr.path] = curr.message;
              return acc;
            },
            {} as Record<string, string>
          )
        );
      }
    },

    onSuccess: (updateInvoice) => {
      queryClient.setQueryData<InvoiceType[]>(["invoices"], (old = []) =>
        old.map((c) => (c.id === updateInvoice.id ? updateInvoice : c))
      );

      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  const deleteInvoice = useMutation({
    mutationKey: ["invoices"],

    mutationFn: async (id: string) => {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) throw json;

      return { id };
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["invoices"] });

      const previous = queryClient.getQueryData<InvoiceType[]>(["invoices"]);

      queryClient.setQueryData<InvoiceType[]>(["invoices"], (old = []) =>
        old.filter((invoice) => invoice.id !== id)
      );

      return { previous };
    },

    onError: (error, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["invoices"], context.previous);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  return {
    createInvoice,
    updateInvoice,
    deleteInvoice,
    fieldErrors,
    isCreating: createInvoice.isPending,
    createError: createInvoice.error,
    isUpdating: updateInvoice.isPending,
    updateError: updateInvoice.error,
    isDeleting: deleteInvoice.isPending,
    deleteError: deleteInvoice.error,
  };
}
