export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { getUserProfile } from "@/features/users/actions/user.actions";

import { authIsRequired } from "@/features/auth/lib/auth-utils";

import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { ToggleOTPForm } from "@/features/auth/components/toggle-otp-form";
import { UpdateProfileForm } from "@/features/auth/components/update-profile-form";

import type { Metadata } from "next";
import { UpdateImageForm } from "@/features/auth/components/update-image-form";

export const metadata: Metadata = {
  title: "Update Profile",
};

export default async function DashboardUpdateProfilePage() {
  await authIsRequired();

  const user = await getUserProfile();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col lg:flex-row gap-6 py-4 items-start pe-6">
      <div className="w-full flex flex-col gap-6">
        <UpdateImageForm image={user?.image ?? ""} />
        <UpdateProfileForm email={user?.email ?? ""} name={user?.name ?? ""} />
      </div>
      <div className="w-full flex flex-col gap-6">
        <ChangePasswordForm />
        <ToggleOTPForm twoFactorEnabled={user.twoFactorEnabled} />
      </div>
    </div>
  );
}
