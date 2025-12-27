import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between max-w-5xl mx-auto">
          <div className="max-md:text-center">
            <h3 className="text-lg font-semibold px-4">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h3>
            <p className="mt-2 w-full max-w-md mx-auto px-4 md:max-w-sm text-sm text-muted-foreground">
              A smart invoicing and business insights dashboard built to help
              you manage customers, revenue, and growth with clarity.
            </p>
          </div>

          <nav className="flex flex-wrap px-4 gap-6 text-sm max-md:w-full max-md:justify-center">
            <Link
              href="/"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                buttonVariants({ variant: "ghost", size: "sm" })
              )}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                buttonVariants({ variant: "ghost", size: "sm" })
              )}
            >
              Dashboard
            </Link>

            <a
              href="https://github.com/abdallah-abde/invoicely"
              target="_blank"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                buttonVariants({ variant: "ghost", size: "sm" })
              )}
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Invoicely. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
