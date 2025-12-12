"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { ThemeColorToggle } from "@/components/theme-color-toggle";
import Link from "next/link";
import AuthenticationToggle from "./authentication-toggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-2 bg-primary-foreground p-2 px-6">
      <Link href="/" className="text-2xl text-primary">
        Invoicely.
      </Link>

      <div className="flex items-center gap-4">
        <ThemeColorToggle />
        <ModeToggle />
        <AuthenticationToggle />
      </div>
    </nav>
  );
}
