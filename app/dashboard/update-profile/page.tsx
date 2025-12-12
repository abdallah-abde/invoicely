import { redirect } from "next/navigation";

import { updateProfile } from "@/app/actions/user";

import { authIsRequired } from "@/lib/auth-utils";

import { ChangePasswordForm } from "@/components/forms/change-password-form";
import { UpdateProfileForm } from "@/components/forms/update-profile-form";

export default async function page() {
  await authIsRequired();

  const user = await updateProfile();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex gap-6 py-4">
      <UpdateProfileForm
        email={user?.email ?? ""}
        name={user?.name ?? ""}
        image={user?.image ?? ""}
        twoFactorEnabled={false}
      />
      <ChangePasswordForm />
    </div>
  );
}
// TODO: TwoFactorEnabled
