import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";
import { translateZodError } from "@/lib/utils/zod-intl";

export function useProducts() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createProduct = useMutation({
    mutationKey: ["products"],

    mutationFn: async (data: any) => {
      setFieldErrors({});

      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },

    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previous = queryClient.getQueryData<any[]>(["products"]);

      queryClient.setQueryData<any[]>(["products"], (old = []) => {
        return [
          ...old,
          {
            ...newProduct,
            id: "temp-id",
            priceAsNumber: Number(newProduct.price),
            _count: { invoices: 0 },
          },
        ];
      });

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["products"], context.previous);
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    retry: false,
  });

  const updateProduct = useMutation({
    mutationKey: ["products"],

    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setFieldErrors({});

      const res = await fetch(`/api/products/${id}`, {
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
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previous = queryClient.getQueryData<any[]>(["products"]);

      queryClient.setQueryData<any[]>(["products"], (old = []) =>
        old.map((product) =>
          product.id === id
            ? {
                ...product,
                ...data,
                priceAsNumber: Number(data.price),
              }
            : product
        )
      );

      return { previous };
    },

    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["products"], context.previous);
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

    onSuccess: (updatedProduct) => {
      queryClient.setQueryData<any[]>(["products"], (old = []) =>
        old.map((c) => (c.id === updatedProduct.id ? updatedProduct : c))
      );

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "top-products"],
      });
    },

    retry: false,
  });

  const deleteProduct = useMutation({
    mutationKey: ["customers", "delete"],

    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      const json = await res.json();

      if (!res.ok) throw json;

      return { id };
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previous = queryClient.getQueryData<any[]>(["products"]);

      queryClient.setQueryData<any[]>(["products"], (old = []) =>
        old.filter((product) => product.id !== id)
      );

      return { previous };
    },

    onError: (error, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["products"], context.previous);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "top-products"],
      });
    },

    retry: false,
  });

  return {
    // productsQuery,
    createProduct,
    updateProduct,
    deleteProduct,
    fieldErrors,
    isCreating: createProduct.isPending,
    createError: createProduct.error,
    isUpdating: updateProduct.isPending,
    updateError: updateProduct.error,
    isDeleting: deleteProduct.isPending,
    deleteError: deleteProduct.error,
  };
}
