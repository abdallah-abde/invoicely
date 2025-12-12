"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Loader } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  email: z.email("Email is required."),
  password: z.string().min(6, "Enter a valid password."),
});

export function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // toast("You submitted the following values:", {
    //   description: (
    //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
    //       <code>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    //   position: "bottom-right",
    //   classNames: {
    //     content: "flex flex-col gap-2",
    //   },
    //   style: {
    //     "--border-radius": "calc(var(--radius)  + 4px)",
    //   } as React.CSSProperties,
    // })

    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: async () => {
            toast.success("Login successfull");
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

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const signInWithGitHub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-in-form-title">Email</FieldLabel>
                  <Input
                    {...field}
                    id="sign-in-form-title"
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
                  <FieldLabel htmlFor="sign-in-form-title">Password</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    id="sign-in-form-title"
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
      <CardFooter className="w-full flex-col">
        <Field
          orientation="horizontal"
          className="flex items-center justify-between w-full"
        >
          <>
            <p className="text-sm flex items-center gap-1">
              Do not have an account?{" "}
              <Link href="/sign-up" className="text-primary">
                {" "}
                Sign up
              </Link>
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="sign-in-form">
              {form.formState.isSubmitting ? (
                <Loader className="siz-6 animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </>
        </Field>
        <div className="flex flex-col w-full my-6 items-center justify-center">
          <p className="text-sm">Or</p>
          <Separator className="gap-6 my-1" />
        </div>
        <div className="flex flex-col w-full gap-3">
          <Button
            type="button"
            className="text-sm cursor-pointer"
            onClick={signInWithGoogle}
          >
            Continue with Google
          </Button>

          <Button
            type="button"
            className="text-sm cursor-pointer"
            onClick={signInWithGitHub}
          >
            Continue with GitHub
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
