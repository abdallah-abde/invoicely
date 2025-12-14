import { redirect } from "next/navigation";

import { getUserProfile } from "@/actions/user";

import { authIsRequired } from "@/lib/auth-utils";

import { ChangePasswordForm } from "@/components/forms/auth/change-password-form";
import { ToggleOTPForm } from "@/components/forms/auth/toggle-otp-form";
import { UpdateProfileForm } from "@/components/forms/auth/update-profile-form";

export default async function page() {
  await authIsRequired();

  const user = await getUserProfile();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex gap-6 py-4 items-start">
      <UpdateProfileForm
        email={user?.email ?? ""}
        name={user?.name ?? ""}
        image={user?.image ?? ""}
      />
      <ChangePasswordForm />
      <ToggleOTPForm twoFactorEnabled={user.twoFactorEnabled} />
    </div>
  );
}
