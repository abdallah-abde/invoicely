"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";

import { profileImageSchema } from "@/features/auth/schemas/auth.schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

import ImageUpload from "@/features/auth/components/image-upload";

interface ProfileImageProps {
  image: string;
}

export function UpdateImageForm({ image }: ProfileImageProps) {
  const form = useForm<z.infer<typeof profileImageSchema>>({
    resolver: zodResolver(profileImageSchema),
    defaultValues: {
      image,
    },
  });

  async function onSubmit(data: z.infer<typeof profileImageSchema>) {
    try {
      await authClient.updateUser(
        {
          image: data.image,
        },
        {
          onSuccess: async () => {
            toast.success("Profile image updated successfully");
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Update your image</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="updateProfileImageForm">
          <FieldGroup>
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <ImageUpload
                    endpoint="imageUploader"
                    defaultUrl={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                      onSubmit({ ...form.getValues(), image: url! });
                    }}
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
    </Card>
  );
}
