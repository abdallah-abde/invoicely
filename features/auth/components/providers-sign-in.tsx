import { authClient } from "@/features/auth/lib/auth-client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ProvidersSignIn() {
  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  const signInWithGitHub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };
  const t = useTranslations();

  return (
    <>
      <div className="flex flex-col w-full my-6 items-center justify-center">
        <p className="text-sm">{t("Auth.or")}</p>
        <Separator className="gap-6 my-1" />
      </div>
      <div className="flex flex-col w-full gap-3">
        <Button
          type="button"
          className="text-sm cursor-pointer"
          onClick={signInWithGoogle}
        >
          {t("Auth.sign-in-with-google")}
        </Button>

        <Button
          type="button"
          className="text-sm cursor-pointer"
          onClick={signInWithGitHub}
        >
          {t("Auth.sign-in-with-github")}
        </Button>
      </div>
    </>
  );
}
