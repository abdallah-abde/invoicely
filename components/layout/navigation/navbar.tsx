"use client";

import Link from "next/link";

import { ThemeColorToggle } from "@/components/theme/theme-color-toggle";

import { ModeToggle } from "@/components/theme/mode-toggle";
import AuthenticationToggle from "@/features/auth/components/authentication-toggle";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-background border-b p-6 fixed w-full z-50">
      <div className="flex items-center justify-center gap-2 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between w-full px-6 gap-4">
          <Link
            href="/"
            className="text-lg md:text-2xl uppercase flex items-center gap-4"
          >
            <Image
              src="/logos/logo.png"
              width={138}
              height={136}
              alt={`${process.env.NEXT_PUBLIC_APP_NAME} logo`}
              className="w-10 h-10"
            />{" "}
            <span className="text-shadow-lg font-black tracking-wider">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeColorToggle />
            <ModeToggle />
            <AuthenticationToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
