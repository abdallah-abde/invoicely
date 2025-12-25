import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  // Helper that performs create and waits for invalidation
  const createInvoiceWithRevalidate = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Create failed");
      }

      const json = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      return json;
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setIsLoading(true);

      console.log("data :", data);

      const res = await fetch(`/api/invoices/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error({ message: error });
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true);

      await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const updateInvoiceWithRevalidate = async ({
    id,
    data,
  }: {
    id: string;
    data: any;
  }) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Update failed");
      }

      const json = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      return json;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invoicesQuery,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    createInvoiceWithRevalidate,
    updateInvoiceWithRevalidate,
    isLoading,
  };
}
