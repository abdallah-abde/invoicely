"use client";

import { UsersTable } from "@/features/users/components/users-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProps, useUsers } from "@/features/users/hooks/use-users";
import { authClient } from "@/features/auth/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader, Plus } from "lucide-react";
import { userSchema } from "@/features/users/schemas/user.schema";
import { Role, ROLE_OPTIONS } from "@/features/users/role.types";
import { hasPermission, isRoleAdmin } from "@/features/auth/services/access";
import { SUPERADMIN_ROLE } from "../lib/constants";
import { useTranslations } from "next-intl";
import { useRole } from "@/hooks/use-role";
import { useDirection } from "@/hooks/use-direction";

export default function UserCU({ users }: { users: UserProps[] }) {
  const router = useRouter();
  const t = useTranslations();
  const dir = useDirection();

  const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

  if (isRoleUser || isRoleModerator) return null;

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
    },
  });

  const { isOpen, setIsOpen, user, setUser } = useUsers();

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);

      const role = ROLE_OPTIONS.find((r) => r === user.role);

      if (role) {
        form.setValue("role", role);
      } else {
        form.setValue("role", "user");
      }
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      if (!user.id) {
        const hasCreatePermission = await hasPermission({
          resource: "user",
          permission: ["create"],
        });

        if (hasCreatePermission) {
          await authClient.admin.createUser({
            name: values.name,
            email: values.email,
            password: values.password as string,
            data: { role: values.role as Role },
          });

          toast.success(t("users.messages.success.add"));
        } else {
          toast.error(t("users.messages.error.add"));
        }
      } else {
        const hasUpdatePermission = await hasPermission({
          resource: "user",
          permission: ["update"],
        });

        if (hasUpdatePermission) {
          await authClient.admin.updateUser({
            userId: user.id,
            data: {
              name: values.name,
              email: values.email,
              role: values.role as Role,
            },
          });

          toast.success(t("users.messages.success.edit"));
        } else {
          toast.error(t("users.messages.error.edit"));
        }
      }
    } catch {
      toast.error(t("Errors.something-went-wrong"));
    } finally {
      setIsOpen(false);
      form.reset();

      setUser({
        id: "",
        name: "",
        image: "",
        role: "",
        email: "",
        emailVerified: false,
        hasDeletePermission: false,
      });

      router.refresh();
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen);

          if (!isOpen) {
            form.reset();

            setUser({
              id: "",
              name: "",
              image: "",
              role: "",
              email: "",
              emailVerified: false,
              hasDeletePermission: false,
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {" "}
              {!!user.id ? t("users.edit") : t("users.add-description")}{" "}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="user-management"
            className="flex flex-col items-end justify-center"
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel>{t("Fields.name.label")}</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      placeholder={t("Fields.name.placeholder")}
                      {...field}
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
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel>{t("Fields.email.label")}</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      placeholder={t("Fields.email.placeholder")}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {!user.id ? (
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel>{t("Fields.password.label")}</FieldLabel>
                      <Input
                        type="password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder={t("Fields.password.placeholder")}
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : null}

              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel>{t("Fields.role.label")}</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={user.role}
                      dir={dir}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("Fields.role.select")} />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.filter((role) =>
                          !isRoleSuperAdmin && role === SUPERADMIN_ROLE
                            ? null
                            : role
                        ).map((role) => (
                          <SelectItem key={role} value={role}>
                            {t(`Labels.${role}-role`)}{" "}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="cursor-pointer max-w-40 self-end my-6"
              disabled={form.formState.isSubmitting}
              form="user-management"
            >
              {form.formState.isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                <>{t("Labels.save")}</>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full py-4">
        <div className="flex w-full justify-between gap-3">
          <h1 className="text-2xl font-semibold">{t("users.label")}</h1>
          {isRoleSuperAdmin ? (
            <Button
              className="cursor-pointer text-xs sm:text-sm"
              onClick={() => setIsOpen(true)}
            >
              <Plus /> <span className="hidden sm:block">{t("users.add")}</span>
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col">
          <UsersTable data={users} />
        </div>
      </div>
    </>
  );
}
