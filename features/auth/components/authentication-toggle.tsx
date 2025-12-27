"use client";

import { useRouter } from "next/navigation";

import { LayoutDashboard, LogIn, LogOut, UserPen } from "lucide-react";

import { authClient } from "@/features/auth/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function AuthenticationToggle() {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  return (
    <>
      {session?.user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="select-none cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name}
                />
                <AvatarFallback className="text-xs">
                  {session.user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-muted-foreground/80">
                <div className="flex items-start justify-center gap-4">
                  <Avatar className="rounded-md size-12">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name}
                    />
                    <AvatarFallback className="rounded-md">
                      {session.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg text-primary">{session.user.name}</p>
                    <p className="text-sm">{session.user.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/dashboard/update-profile"
                  className="flex items-center gap-2"
                >
                  <UserPen className="size-4" /> Update profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <p
                  role="button"
                  className="cursor-pointer"
                  onClick={async () => {
                    await authClient.signOut();
                    router.push("/");
                  }}
                >
                  <LogOut className="size-4" /> Sign out
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
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
