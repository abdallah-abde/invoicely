"use client";

import { useRouter } from "next/navigation";

import { LogIn, LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

export default function AuthenticationToggle() {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  return (
    <>
      {session?.user ? (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="Sign out"
          onClick={async () => {
            await authClient.signOut();
          }}
        >
          <LogOut className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="Sign in"
          onClick={() => router.push("/sign-in")}
        >
          <LogIn className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
        </Button>
      )}
    </>
  );
}
