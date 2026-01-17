"use client";

import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  LogIn,
  LogOut,
  LucideProps,
  UserPen,
} from "lucide-react";

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
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/use-direction";
import { useArabic } from "@/hooks/use-arabic";
import React from "react";

export default function AuthenticationToggle() {
  const router = useRouter();

  const dir = useDirection();
  const isArabic = useArabic();
  const t = useTranslations();

  const { data: session } = authClient.useSession();

  return (
    <>
      {session?.user ? (
        <DropdownMenu dir={dir}>
          <DropdownMenuTrigger asChild className="select-none cursor-pointer">
            {renderAvatar({
              name: session.user.name,
              image: session.user.image || "",
              fallbackCustomStyles: "text-xs",
            })}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-muted-foreground/80">
              <div className="flex items-start justify-center gap-4">
                {renderAvatar({
                  name: session.user.name,
                  image: session.user.image || "",
                  className: "rounded-md size-12",
                  fallbackCustomStyles: "rounded-md",
                })}
                <div>
                  <p className="text-lg text-primary">{session.user.name}</p>
                  <p className="text-sm">{session.user.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard" className="flex items-center gap-2">
                {renderIcon({
                  Icon: LayoutDashboard,
                  text: t("dashboard"),
                  isArabic,
                })}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/dashboard/update-profile"
                className="flex items-center gap-2"
              >
                {renderIcon({
                  Icon: UserPen,
                  text: t("update-profile.label"),
                  isArabic,
                })}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer w-full justify-start"
                onClick={async () => {
                  await authClient.signOut();
                  router.push("/");
                }}
              >
                {renderIcon({
                  Icon: LogOut,
                  text: t("Auth.sign-out"),
                  isArabic,
                })}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title={t("Auth.sign-in.title")}
          onClick={() => router.push("/sign-in")}
        >
          {renderIcon({
            Icon: LogIn,
            isArabic,
            className:
              "h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all",
          })}
        </Button>
      )}
    </>
  );
}

function renderAvatar({
  name,
  image,
  className = "",
  fallbackCustomStyles,
}: {
  name: string;
  image: string;
  className?: string | null;
  fallbackCustomStyles: string;
}) {
  return (
    <Avatar className={className ?? ""}>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className={fallbackCustomStyles}>
        {name.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

function renderIcon({
  Icon,
  text,
  isArabic,
  className = "",
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text?: string | null;
  isArabic: boolean;
  className?: string | null;
}) {
  return (
    <>
      <Icon
        className={cn("size-4", className, isArabic ? "rotate-y-180" : "")}
      />{" "}
      {text}
    </>
  );
}
