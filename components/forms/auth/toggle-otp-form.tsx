"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";

import { toggleOTPSchema } from "@/schemas/auth-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ToggleOTPFormProps {
  twoFactorEnabled: boolean;
}

export function ToggleOTPForm({ twoFactorEnabled }: ToggleOTPFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof toggleOTPSchema>>({
    resolver: zodResolver(toggleOTPSchema),
    defaultValues: {
      password: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = () => {
    setIsOpen(true);
  };

  async function onSubmit(data: z.infer<typeof toggleOTPSchema>) {
    try {
      if (twoFactorEnabled) {
        const { error } = await authClient.twoFactor.disable({
          password: data.password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Two Factor Authentication Disabled");
        router.refresh();
      } else {
        const { error, data: d } = await authClient.twoFactor.enable({
          password: data.password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Two Factor Authentication Enabled");
        router.refresh();
      }
    } catch (error) {
      throw new Error("Something went wrong");
    } finally {
      setIsOpen(false);
      form.reset();
    }
  }

  return (
    <Card className="w-full max-w-smsm:max-w-md">
      <CardHeader>
        <CardTitle>Two Factor Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-3">
          <Label>{!twoFactorEnabled ? "Enable 2FA" : "Disable 2FA"}</Label>
          <Switch checked={twoFactorEnabled} onCheckedChange={handleChange} />
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {!twoFactorEnabled
                  ? "Enable two factor authentication"
                  : "Disable two factor authentication"}
              </DialogTitle>
              <DialogDescription>
                Please confirm your password to{" "}
                {!twoFactorEnabled ? "enable" : "disable"} 2FA in your account.
              </DialogDescription>
            </DialogHeader>

            <form
              id="twoFactorAuthenticationForm"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="twoFactorAuthenticationForm-password">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="twoFactorAuthenticationForm-password"
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
                form="twoFactorAuthenticationForm"
                className="cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader className="siz-6 animate-spin" />
                ) : !twoFactorEnabled ? (
                  "Enable 2FA"
                ) : (
                  "Disable 2FA"
                )}
              </Button>
            </Field>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
