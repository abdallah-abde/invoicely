"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/features/auth/lib/auth-client";

import { signUpSchema } from "@/features/auth/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import ProvidersSignIn from "@/features/auth/components/providers-sign-in";
import { useTranslations } from "next-intl";

export function SignUpForm() {
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          callbackURL: "/sign-in",
        },
        {
          onSuccess: async () => {
            toast.success(() => (
              <>
                <p>{t("Auth.sign-up.success.message-1")}</p>
                <p>{t("Auth.sign-up.success.message-2")}</p>
              </>
            ));
            router.push("/sign-in");
          },

          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      throw new Error(t("Errors.something-went-wrong"));
    }
  }

  return (
    <Card className="w-full sm:max-w-md ">
      <CardHeader>
        <CardTitle>{t("Auth.sign-up.title")}</CardTitle>
        <CardDescription>{t("Auth.sign-up.form-description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signUpForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signUpForm-name">
                    {t("Fields.name.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signUpForm-name"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("Fields.name.placeholder")}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signUpForm-email">
                    {t("Fields.email.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signUpForm-email"
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
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signUpForm-password">
                    {t("Fields.password.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signUpForm-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("Fields.password.placeholder")}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signUpForm-confirmPassword">
                    {t("Fields.confirm-password.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signUpForm-confirmPassword"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("Fields.confirm-password.placeholder")}
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
      </CardContent>
      <CardFooter className="w-full flex flex-col">
        <Field
          orientation="horizontal"
          className="flex flex-col md:flex-row gap-4 items-center justify-between w-full"
        >
          <p className="text-sm flex items-center gap-2">
            {t("Auth.sign-up.form-already-have-account")}
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary/50 transition duration-300"
            >
              {t("Auth.sign-in.title")}
            </Link>
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="cursor-pointer"
          >
            {t("Form.reset")}
          </Button>
          <Button type="submit" form="signUpForm" className="cursor-pointer">
            {form.formState.isSubmitting ? (
              <Loader className="siz-6 animate-spin" />
            ) : (
              <> {t("Auth.sign-up.title")}</>
            )}
          </Button>
        </Field>
        <ProvidersSignIn />
      </CardFooter>
    </Card>
  );
}
