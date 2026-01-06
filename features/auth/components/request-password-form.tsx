"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/features/auth/lib/auth-client";

import { requestPasswordSchema } from "@/features/auth/schemas/auth.schema";

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

export function RequestPasswordForm() {
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<z.infer<typeof requestPasswordSchema>>({
    resolver: zodResolver(requestPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isEmailSent, setIsEmailSent] = useState(false);

  async function onSubmit(data: z.infer<typeof requestPasswordSchema>) {
    try {
      await authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: "/reset-password",
        },
        {
          onSuccess: async () => {
            setIsEmailSent(true);
          },
          onError: async (ctx) => {
            setIsEmailSent(false);
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      throw new Error(t("Errors.something-went-wrong"));
    }
  }

  return (
    <>
      {isEmailSent ? (
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>{t("Auth.request-password.sent-title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full p-6">
              {t("Auth.request-password.sent")}
            </div>
            <Button
              className="cursor-pointer"
              onClick={() => {
                router.push("/sign-in");
              }}
            >
              {t("Auth.request-password.back-to-sign-in")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>{t("Auth.request-password.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="resetPasswordForm" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="resetPasswordForm-email">
                        {t("Fields.email.label")}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="resetPasswordForm-email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder={t("Fields.email.placeholder")}
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
                {t("Form.reset")}
              </Button>
              <Button
                type="submit"
                form="resetPasswordForm"
                className="cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>{t("Labels.send-request")}</>
                )}
              </Button>
            </Field>
          </CardContent>
        </Card>
      )}
    </>
  );
}
