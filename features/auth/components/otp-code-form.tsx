"use client";

import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/features/auth/lib/auth-client";

import { oTPCodeSchema } from "@/features/auth/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function OTPCodeForm() {
  const router = useRouter();
  const t = useTranslations();

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
      throw new Error(t("Errors.something-went-wrong"));
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{t("Auth.otp.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="oTPCodeForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="oTPCodeForm-code">
                    {t("Fields.code.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="oTPCodeForm-code"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("Fields.code.placeholder")}
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
              <Loader className="animate-spin" />
            ) : (
              <>{t("Labels.verify")}</>
            )}
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
}
