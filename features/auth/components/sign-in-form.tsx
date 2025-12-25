"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/features/auth/lib/auth-client";

import { signInSchema } from "@/features/auth/schemas/auth.schema";

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

export function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: async () => {
            // TODO: when sign in, if email not verified, you must not let the user in, also, if only when the two factor enabled send the otp.
            const { error } = await authClient.twoFactor.sendOtp({});

            if (error) {
              toast.error(error.message);
            }

            router.push("/two-factor");
          },

          onError: (ctx) => {
            let error = "";
            if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
              error = "A new verification code is sent";
            }
            toast.error(() => (
              <>
                <p>{ctx.error.message}</p>
                {error && <p>{error}</p>}
              </>
            ));
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
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signInForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signInForm-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="signInForm-email"
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
                  <FieldLabel
                    htmlFor="signInForm-password"
                    className="flex items-center justify-between"
                  >
                    <span>Password</span>
                    <Link
                      href="/request-password"
                      className="text-primary hover:text-primary/50 transition duration-300"
                    >
                      Forgot password
                    </Link>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signInForm-password"
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
            Do not have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:text-primary/50 transition duration-300"
            >
              {" "}
              Sign up
            </Link>
          </p>
          <Button type="submit" form="signInForm" className="cursor-pointer">
            {form.formState.isSubmitting ? (
              <Loader className="siz-6 animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>
        </Field>
        <ProvidersSignIn />
      </CardFooter>
    </Card>
  );
}
