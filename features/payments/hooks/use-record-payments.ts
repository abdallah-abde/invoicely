import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";
import { translateZodError } from "@/lib/utils/zod-intl";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { fetchJson } from "@/lib/api/fetch-json";

export function useRecordPayments() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createRecordPayment = useMutation({
    mutationKey: ["invoices"],

    mutationFn: async (data: any) => {
      setFieldErrors({});

      return fetchJson(`/api/invoices/${data.invoiceId}/payment`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
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
            _count: { products: 0, Payments: 0 },
            products: [],
            customer: { name: "" },
            createdBy: { name: "" },
            paidAmount: 0,
            rest: 0,
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
          t,
        );

        setFieldErrors(
          translated.reduce(
            (acc, curr) => {
              acc[curr.path] = curr.message;
              return acc;
            },
            {} as Record<string, string>,
          ),
        );
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      await queryClient.invalidateQueries({ queryKey: ["payments"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  return {
    createRecordPayment,
    fieldErrors,
    isCreating: createRecordPayment.isPending,
    createError: createRecordPayment.error,
  };
}
