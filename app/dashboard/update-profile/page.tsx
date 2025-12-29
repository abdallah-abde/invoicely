export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { getUserProfile } from "@/features/users/actions/user.actions";

import { authIsRequired } from "@/features/auth/lib/auth-utils";

import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { ToggleOTPForm } from "@/features/auth/components/toggle-otp-form";
import { UpdateProfileForm } from "@/features/auth/components/update-profile-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Profile",
};

export default async function page() {
  await authIsRequired();

  const user = await getUserProfile();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col lg:flex-row gap-6 py-4 items-start pr-6">
      <UpdateProfileForm
        email={user?.email ?? ""}
        name={user?.name ?? ""}
        image={user?.image ?? ""}
      />
      <div className="w-full flex flex-col gap-6">
        <ChangePasswordForm />
        <ToggleOTPForm twoFactorEnabled={user.twoFactorEnabled} />
      </div>
    </div>
  );
}
