import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InvoiceCategory,
  InvoiceType,
} from "@/features/invoices/invoice.types";
import { ApiError } from "@/lib/api/api-error";
import { parseApiError } from "@/lib/api/parse-api-error";
import { fetchJson } from "@/lib/api/fetch-json";

export function useInvoices(type: InvoiceCategory) {
  const queryClient = useQueryClient();

  const createInvoice = useMutation({
    mutationKey: ["invoices", type],

    mutationFn: async (data: any) => {
      return fetchJson("/api/invoices", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices", type] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  const updateInvoice = useMutation({
    mutationKey: ["invoices", type],

    mutationFn: async ({
      id,
      data,
      isDraft,
    }: {
      id: string;
      data: any;
      isDraft: boolean;
    }) => {
      return fetchJson(`/api/invoices/${id}${!isDraft ? "/notes" : ""}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["invoices", type] });

      const previous = queryClient.getQueryData<InvoiceType[]>([
        "invoices",
        type,
      ]);

      queryClient.setQueryData<InvoiceType[]>(["invoices", type], (old = []) =>
        old.map((invoice) =>
          invoice.id === id
            ? {
                ...invoice,
                ...data,
              }
            : invoice,
        ),
      );

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["invoices", type], context.previous);
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices", type] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  const deleteInvoice = useMutation({
    mutationKey: ["invoices", type],

    mutationFn: async (id: string) => {
      await fetchJson(`/api/invoices/${id}`, { method: "DELETE" });

      return { id };
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["invoices", type] });

      const previous = queryClient.getQueryData<InvoiceType[]>([
        "invoices",
        type,
      ]);

      queryClient.setQueryData<InvoiceType[]>(["invoices", type], (old = []) =>
        old.filter((i) => i.id !== id),
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["invoices", type], context.previous);
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices", type] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  return {
    createInvoice,
    updateInvoice,
    deleteInvoice,

    isCreating: createInvoice.isPending,
    createError: createInvoice.error as ApiError | null,

    isUpdating: updateInvoice.isPending,
    updateError: updateInvoice.error as ApiError | null,

    isDeleting: deleteInvoice.isPending,
    deleteError: deleteInvoice.error as ApiError | null,

    parseApiError,
  };
}
