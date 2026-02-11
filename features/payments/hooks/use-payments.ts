import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";
import { translateZodError } from "@/lib/utils/zod-intl";
import { PaymentType } from "@/features/payments/payment.types";
import { fetchJson } from "@/lib/api/fetch-json";

export function usePayments() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createPayment = useMutation({
    mutationKey: ["payments"],

    mutationFn: async (data: any) => {
      setFieldErrors({});

      return fetchJson("/api/payments", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    onMutate: async (newPayment) => {
      await queryClient.cancelQueries({ queryKey: ["payments"] });

      const previous = queryClient.getQueryData<PaymentType[]>(["payments"]);

      queryClient.setQueryData<PaymentType[]>(["payments"], (old = []) => {
        return [
          ...old,
          {
            ...newPayment,
            id: "temp-id",
            dateAsString: "",
            amountAsNumber: Number(newPayment.amount),
            invoice: {
              number: "",
              customer: {
                name: "",
              },
            },
          },
        ];
      });

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["payments"], context.previous);
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
      await queryClient.invalidateQueries({ queryKey: ["payments"] });
      // await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  const updatePayment = useMutation({
    mutationKey: ["payments"],

    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setFieldErrors({});

      return fetchJson("/api/payments", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["payments"] });

      const previous = queryClient.getQueryData<PaymentType[]>(["payments"]);

      queryClient.setQueryData<PaymentType[]>(["payments"], (old = []) =>
        old.map((payment) =>
          payment.id === id
            ? {
                ...payment,
                ...data,
                dateAsString: "",
                amountAsNumber: Number(data.amount),
                invoice: {
                  number: "",
                  customer: {
                    name: "",
                  },
                },
              }
            : payment,
        ),
      );

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["payments"], context.previous);
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

    onSuccess: (updatePayment) => {
      queryClient.setQueryData<PaymentType[]>(["payments"], (old = []) =>
        old.map((c) => (c.id === updatePayment.id ? updatePayment : c)),
      );

      // queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  const deletePayment = useMutation({
    mutationKey: ["payments"],

    mutationFn: async (id: string) => {
      await fetchJson(`/api/payments/${id}`, {
        method: "DELETE",
      });

      return { id };
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["payments"] });

      const previous = queryClient.getQueryData<PaymentType[]>(["payments"]);

      queryClient.setQueryData<PaymentType[]>(["payments"], (old = []) =>
        old.filter((payment) => payment.id !== id),
      );

      return { previous };
    },

    onError: (error, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["payments"], context.previous);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      // queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    retry: false,
  });

  return {
    createPayment,
    updatePayment,
    deletePayment,

    fieldErrors,

    isCreating: createPayment.isPending,
    createError: createPayment.error,

    isUpdating: updatePayment.isPending,
    updateError: updatePayment.error,

    isDeleting: deletePayment.isPending,
    deleteError: deletePayment.error,
  };
}
