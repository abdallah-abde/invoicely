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
import {
  Role,
  ROLE_OPTIONS,
  userSchema,
} from "@/features/users/schemas/user.schema";

export default function UserCU({ users }: { users: UserProps[] }) {
  const router = useRouter();

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
        await authClient.admin.createUser({
          name: values.name,
          email: values.email,
          password: values.password as string,
          role: values.role as Role,
        });

        toast.success("New user created successfully");
      } else {
        await authClient.admin.updateUser({
          userId: user.id,
          data: {
            name: values.name,
            email: values.email,
            role: values.role as Role,
          },
        });

        toast.success("User updated successfully");
      }
    } catch {
      toast.error("Something went wrong");
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
            <DialogTitle> {!!user.id ? "Edit" : "Create user"} </DialogTitle>
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
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      {...field}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
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
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
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
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        {...field}
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                        type="password"
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
                    <FieldLabel>Role</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={user.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}{" "}
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
                <Loader className="size-6 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full py-4">
        <div className="flex w-full justify-between">
          <h1 className="text-2xl font-semibold">Users</h1>
          <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
            <Plus /> Add User
          </Button>
        </div>

        <div className="flex flex-col">
          <UsersTable data={users} />
        </div>
      </div>
    </>
  );
}
