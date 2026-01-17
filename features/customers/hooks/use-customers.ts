import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";
import { translateZodError } from "@/lib/utils/zod-intl";
import { fetchCustomers } from "../api/customer.api";

export function useCustomers() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createCustomer = useMutation({
    mutationKey: ["customers"],

    mutationFn: async (data: any) => {
      setFieldErrors({});

      const res = await fetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },

    onMutate: async (newCustomer) => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      const previous = queryClient.getQueryData<any[]>(["customers"]);

      queryClient.setQueryData<any[]>(["customers"], (old = []) => [
        ...old,
        { ...newCustomer, id: "temp-id", _count: { invoices: 0 } },
      ]);

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["customers"], context.previous);
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "new-customers"],
      });
    },

    retry: false,
  });

  const updateCustomer = useMutation({
    mutationKey: ["customers"],

    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setFieldErrors({});

      const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      const previous = queryClient.getQueryData<any[]>(["customers"]);

      queryClient.setQueryData<any[]>(["customers"], (old = []) =>
        old.map((customer) =>
          customer.id === id
            ? {
                ...customer,
                ...data,
              }
            : customer
        )
      );

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["customers"], context.previous);
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

    onSuccess: (updatedCustomer) => {
      queryClient.setQueryData<any[]>(["customers"], (old = []) =>
        old.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      );
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "top-customers"],
      });
    },

    retry: false,
  });

  const deleteCustomer = useMutation({
    mutationKey: ["customers", "delete"],

    mutationFn: async (id: string) => {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });

      const json = await res.json();

      if (!res.ok) throw json;

      return { id };
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      const previous = queryClient.getQueryData<any[]>(["customers"]);

      queryClient.setQueryData<any[]>(["customers"], (old = []) =>
        old.filter((customer) => customer.id !== id)
      );

      return { previous };
    },

    onError: (error, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["customers"], context.previous);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "top-customers"],
      });
    },

    retry: false,
  });

  return {
    customersQuery,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fieldErrors,
    isCreating: createCustomer.isPending,
    createError: createCustomer.error,
    isUpdating: updateCustomer.isPending,
    updateError: updateCustomer.error,
    isDeleting: deleteCustomer.isPending,
    deleteError: deleteCustomer.error,
  };
}
