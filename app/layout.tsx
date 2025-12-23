import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import ThemeDataProvider from "@/context/theme-data-provider";

import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!), // TODO: Change to real domain

  title: {
    default: `${process.env.NEXT_PUBLIC_APP_NAME} | Smart Invoicing & Business Dashboard`,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  },

  description: `${process.env.NEXT_PUBLIC_APP_NAME} is a modern invoicing and customer management dashboard. Track revenue, manage products, analyze customers, and gain business insights with real-time charts and reports.`,

  keywords: [
    "Invoicing Dashboard",
    "Invoice Management",
    "Customer Management",
    "Business Analytics",
    "Revenue Tracking",
    "Next.js Dashboard",
    "SaaS Invoicing",
    "Prisma",
    "PostgreSQL",
  ],

  authors: [{ name: "Abdullah Abde" }],
  creator: "Abdullah Abde",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL!,
    title: `${process.env.NEXT_PUBLIC_APP_NAME} | Smart Invoicing & Business Dashboard`,
    description:
      "Manage invoices, customers, and products while tracking revenue and growth through powerful analytics and charts.",
    siteName: `${process.env.NEXT_PUBLIC_APP_NAME}`,
    images: [
      {
        url: "/og-image.png", // Image 1200 x 630
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_APP_NAME} Dashboard Preview`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${process.env.NEXT_PUBLIC_APP_NAME} | Smart Invoicing Dashboard`,
    description:
      "A modern invoicing and customer management dashboard with analytics, reports, and revenue tracking.",
    images: ["/og-image.png"],
    creator: "@invoicely", // Optional
  },

  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
    shortcut: ["/favicon.ico"],
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} antialiased scroll-smooth!`}
      suppressHydrationWarning
    >
      <body cz-shortcut-listen="true" className="font-montserrat scroll-smooth">
        <QueryProvider>
          <NextThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeDataProvider>
              <div className="w-full">{children}</div>
              <Toaster />
            </ThemeDataProvider>
          </NextThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

// TODO: Rename all page.tsx files and refactor code
// TODO: lib folder refactoring
// TODO: README file
// TODO: prisma seed file
// TODO: env file & appName & To Email
// TODO: Email From (Resend) / Production
// TODO: Email to (Reset Password + Verification Email + OTP) / Production
// TODO: price in $ (currency converter with options / like syrian pound ...etc)
// TODO: Delete image in update profile
// TODO: Fav icon for dark mode
// TODO: Footer
