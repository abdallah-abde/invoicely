"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { signUpSchema } from "@/schemas/auth-schemas";

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

import ProvidersSignIn from "@/components/forms/auth/providers-sign-in";

export function SignUpForm() {
  const router = useRouter();

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
                <p>Sign up successfully done</p>
                <p>A verification email sent</p>
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
      throw new Error("Something went wrong");
    }
  }

  return (
    <Card className="w-full sm:max-w-md ">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create an account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signUpForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signUpForm-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="signUpForm-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your name"
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
                  <FieldLabel htmlFor="signUpForm-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="signUpForm-email"
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
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signUpForm-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signUpForm-password"
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
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signUpForm-confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signUpForm-confirmPassword"
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
      </CardContent>
      <CardFooter className="w-full flex flex-col">
        <Field
          orientation="horizontal"
          className="flex items-center justify-between w-full"
        >
          <p className="text-sm flex items-center gap-2">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary/50 transition duration-300"
            >
              {" "}
              Sign in
            </Link>
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="cursor-pointer"
          >
            Reset
          </Button>
          <Button type="submit" form="signUpForm" className="cursor-pointer">
            {form.formState.isSubmitting ? (
              <Loader className="siz-6 animate-spin" />
            ) : (
              "Sign up"
            )}
          </Button>
        </Field>
        <ProvidersSignIn />
      </CardFooter>
    </Card>
  );
}
