import { authClient } from "@/lib/auth-client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
  return (
    <>
      <div className="flex flex-col w-full my-6 items-center justify-center">
        <p className="text-sm">Or</p>
        <Separator className="gap-6 my-1" />
      </div>
      <div className="flex flex-col w-full gap-3">
        <Button
          type="button"
          className="text-sm cursor-pointer"
          onClick={signInWithGoogle}
        >
          Continue with Google
        </Button>

        <Button
          type="button"
          className="text-sm cursor-pointer"
          onClick={signInWithGitHub}
        >
          Continue with GitHub
        </Button>
      </div>
    </>
  );
}
