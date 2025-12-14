"use client";

import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { oTPCodeSchema } from "@/schemas/auth-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function OTPCodeForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof oTPCodeSchema>>({
    resolver: zodResolver(oTPCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof oTPCodeSchema>) {
    try {
      await authClient.twoFactor.verifyOtp(
        {
          code: data.code,
        },
        {
          onSuccess: async () => {
            router.push("/dashboard");
          },
          onError: async (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Enter your OTP code</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="oTPCodeForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="oTPCodeForm-code">Code</FieldLabel>
                  <Input
                    {...field}
                    id="oTPCodeForm-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter the OTP code you received at your email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <Field
          orientation="horizontal"
          className="flex items-center justify-between w-full mt-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="cursor-pointer"
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="oTPCodeForm"
            className="cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader className="siz-6 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
}
