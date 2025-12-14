"use client";

import { useRouter, useSearchParams } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { resetPasswordSchema } from "@/schemas/auth-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const router = useRouter();

  const params = useSearchParams();
  const token = params.get("token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      await authClient.resetPassword(
        {
          newPassword: data.newPassword,
          token: token as string,
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
        <CardTitle>Change your password</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="resetPasswordForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="resetPasswordForm-newPassword">
                    New Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="resetPasswordForm-newPassword"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="resetPasswordForm-confirmNewPassword">
                    Confirm New Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="resetPasswordForm-confirmNewPassword"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
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
            form="resetPasswordForm"
            className="cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader className="siz-6 animate-spin" />
            ) : (
              "Reset password"
            )}
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
}
