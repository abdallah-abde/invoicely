import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between max-w-5xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              A smart invoicing and business insights dashboard built to help
              you manage customers, revenue, and growth with clarity.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <a
              href="https://github.com/your-repo"
              target="_blank"
              className="text-muted-foreground hover:text-foreground"
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
