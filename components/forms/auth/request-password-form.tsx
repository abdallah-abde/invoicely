"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { requestPasswordSchema } from "@/schemas/auth-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function RequestPasswordForm() {
  const router = useRouter();

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
      throw new Error("Something went wrong");
    }
  }

  return (
    <>
      {isEmailSent ? (
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full p-6">
              A password reset link has been sent to your email.
            </div>
            <Button
              className="cursor-pointer"
              onClick={() => {
                router.push("/sign-in");
              }}
            >
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>Enter your email</CardTitle>
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
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="resetPasswordForm-email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your email"
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
                  "Send request"
                )}
              </Button>
            </Field>
          </CardContent>
        </Card>
      )}
    </>
  );
}

// TODO: twoFactorEnabled
