"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Loader } from "lucide-react";

import { authClient } from "@/features/auth/lib/auth-client";

import { toggleOTPSchema } from "@/features/auth/schemas/auth.schema";

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
import { useTranslations } from "next-intl";

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

  const t = useTranslations();

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
        toast.success(
          t("update-profile.2FA.messages.success", {
            isDisabled: t("Labels.disabled"),
          })
        );
        router.refresh();
      } else {
        const { error, data: d } = await authClient.twoFactor.enable({
          password: data.password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success(
          t("update-profile.2FA.messages.success", {
            isDisabled: t("Labels.enabled"),
          })
        );
        router.refresh();
      }
    } catch (error) {
      throw new Error(t("Errors.something-went-wrong"));
    } finally {
      setIsOpen(false);
      form.reset();
    }
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>{t("update-profile.2FA.label")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-3">
          <Label>
            {!twoFactorEnabled
              ? t("update-profile.2FA.enable")
              : t("update-profile.2FA.disable")}
          </Label>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleChange}
            className="cursor-pointer"
          />
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {!twoFactorEnabled
                  ? t("update-profile.2FA.dialog.enable")
                  : t("update-profile.2FA.dialog.enable")}
              </DialogTitle>
              <DialogDescription>
                {t("update-profile.2FA.description", {
                  isDisabled: !twoFactorEnabled
                    ? t("Labels.enable")
                    : t("Labels.disable"),
                })}
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
                        {t("Fields.password.label")}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="twoFactorAuthenticationForm-password"
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
                form="twoFactorAuthenticationForm"
                className="cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : !twoFactorEnabled ? (
                  <>{t("update-profile.2FA.enable")}</>
                ) : (
                  <>{t("update-profile.2FA.disable")}</>
                )}
              </Button>
            </Field>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
