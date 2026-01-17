import { getUserRole } from "@/features/auth/lib/auth-utils";
// import AccessDenied from "@/features/shared/components/access-denied";
import { USER_ROLE } from "@/features/users/lib/user.constants";
// import { getTranslations } from "next-intl/server";
import DashboardClient from "@/features/dashboard/components/dashboard-client";
import { notFound } from "next/navigation";
// import { notFound } from "next/navigation";

export default async function DashboardHomePage() {
  const role = await getUserRole();
  // const t = await getTranslations();

  if (role === USER_ROLE) return notFound();
  // if (role === USER_ROLE)
  //   return (
  //     <AccessDenied
  //       errorName=""
  //       message={t("Errors.not-allowed-to-see-page")}
  //     />
  //   );

  return (
    <div className="space-y-6 py-6">
      <DashboardClient />
    </div>
  );
}
