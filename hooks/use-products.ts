import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProducts() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data: any) => {
      setIsLoading(true);

      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setIsLoading(true);

      const res = await fetch(`/api/products/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error({ message: error });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true);

      await fetch(`/api/products/${id}`, { method: "DELETE" });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onSettled: () => {
      setIsLoading(false);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  return {
    productsQuery,
    createProduct,
    updateProduct,
    deleteProduct,
    isLoading,
  };
}
