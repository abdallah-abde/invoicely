import { useTranslations } from "next-intl";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";
import { translateZodError } from "@/lib/utils/zod-intl";
// import { toast } from "sonner";

export function usePayments() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const t = useTranslations();

  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("/api/payments");
      return res.json();
    },
  });

  const createPayment = useMutation({
    mutationFn: async (data: any) => {
      setIsLoading(true);

      console.log(data);
      const res = await fetch("/api/payments", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error: any) => {
      if (error?.name === "ZodError") {
        const zodError = new ZodError(error.issues);

        const translated = translateZodError(zodError, t);

        // translated.forEach((err) => {
        //   toast.error(err.message);
        // });

        return;
      }

      // toast.error("error");
    },
  });

  const updatePayment = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setIsLoading(true);

      const res = await fetch(`/api/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Update failed");

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error: any) => {
      if (error?.name === "ZodError") {
        const zodError = new ZodError(error.issues);

        const translated = translateZodError(zodError, t);

        // translated.forEach((err) => {
        //   toast.error(err.message);
        // });

        return;
      }

      // toast.error("error");
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true);

      await fetch(`/api/payments/${id}`, { method: "DELETE" });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  return {
    paymentsQuery,
    createPayment,
    updatePayment,
    deletePayment,
    isLoading,
  };
}
