import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useCustomers() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/customers");
      return res.json();
    },
  });

  const createCustomer = useMutation({
    mutationFn: async (data: any) => {
      setIsLoading(true);

      const res = await fetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setIsLoading(true);

      const res = await fetch(`/api/customers/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error({ message: error });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true);

      await fetch(`/api/customers/${id}`, { method: "DELETE" });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  return {
    customersQuery,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    isLoading,
  };
}
