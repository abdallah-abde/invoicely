"use client";

import Link from "next/link";

import { ThemeColorToggle } from "@/components/theme/theme-color-toggle";

import { ModeToggle } from "@/components/theme/mode-toggle";
import AuthenticationToggle from "@/components/authentication-toggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-2 bg-primary-foreground p-2 px-6">
      <Link href="/" className="text-2xl text-primary uppercase">
        {process.env.NEXT_PUBLIC_APP_NAME}
      </Link>
      <div className="flex items-center gap-4">
        <ThemeColorToggle />
        <ModeToggle />
        <AuthenticationToggle />
      </div>
    </nav>
  );
}
