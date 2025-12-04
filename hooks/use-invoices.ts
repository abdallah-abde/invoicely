import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useInvoices() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const invoicesQuery = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await fetch("/api/invoices");
      return res.json();
    },
  });

  const createInvoice = useMutation({
    mutationFn: async (data: any) => {
      setIsLoading(true);

      const res = await fetch("/api/invoices", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true);

      await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  return { invoicesQuery, createInvoice, deleteInvoice, isLoading };
}
