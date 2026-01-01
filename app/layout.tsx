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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),

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
        url: "/images/og-image.png", // Image 1200 x 630
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
    images: ["/images/og-image.png"],
    creator: "@invoicely", // Optional
  },

  // icons: {
  //   icon: [
  //     {
  //       url: "/logos/favicon-dark.ico",
  //       rel: "icon",
  //       type: "image/ico",
  //       media: "(prefers-color-scheme: light)",
  //     },
  //     {
  //       url: "/logos/favicon-light.ico",
  //       rel: "icon",
  //       type: "image/ico",
  //       media: "(prefers-color-scheme: dark)",
  //     },
  //   ],

  // apple: [{ url: "/apple-touch-icon.png" }],
  // shortcut: ["/favicon.ico"],
  // },

  // manifest: "/site.webmanifest",
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

// TODO: Change Email From + Email To in .env file (for Resend) in Production When a custom domain is in use
// TODO: Currency Exchange Rates API integration (like; exchangerate-api.com; ex: usd to syp and other currencies)
// TODO: Fav icon for dark mode
// TODO: Filter by Date
// TODO: Refactor code in all files
// TODO: lib folder refactoring
// TODO: README file
// TODO: prisma seed file
// TODO: Delete image in update profile
// TODO: Currency symbol in invoices and payments
// TODO: Tests
// TODO: CI/CD
// TODO: Docker
// TODO: Analytics (like; Vercel Analytics; Google Analytics; Plausible; ...etc)
// TODO: Notifications center (in-app notifications)
// TODO: Audit Logs
// TODO: User Roles Management (Admin, User, ...etc)
// TODO: User Profile Pictures (Avatar upload)
// TODO: Better error handling and messages
// TODO: Optimize loading states and spinners
// TODO: Optimize performance and bundle size
// TODO: Accessibility improvements
// TODO: SEO improvements
// TODO: Internationalization (i18n) and localization (l10n)
// TODO: Arabic language support (RTL layout)
// TODO: In Invoice products list, show subtotal per product (quantity * unit price) + when change the quantity or unit price, update the total accordingly
// TODO: Arabic PDF invoices generation
// TODO: View product details page (contains product info + list of invoices that include this product + some charts about this product sales)
// TODO: View customer details page (contains customer info + list of invoices for this customer + some charts about this customer purchases)
// TODO: Make customer email + taxNumber optional fields
// TODO: Make better format for the phone numbers based on the country code (ex: syrian number +(963)-11-1234567; us number +(1)-123-456-7890; ...etc, suggest to use libphonenumber-js)
// TODO: Automatic generate invoice Number
// TODO: Whem creating invoice give the user the option to draft it if not so it will be sent unless the user mark it as paid, for overdue invoices they will be brought through a custom page that shows all overdue invoices and give the option to send reminder emails to the customers with overdue invoices, for canceled invoices they will be moved to a separate page that shows all canceled invoices and they will be out of any related calculations
// TODO: When creating a payment, give the option to select multiple invoices to pay at once
// TODO: when creating invoice that marked as paid, enter a record in the payments table automatically
// TODO: Don't bring canceled, drafted and paid invoices when payment is done, payment is just for sent and overdue invoices
// TODO: Put a button in the invoices list (for drafted invoices) to send the invoice (change its status to sent) or in the invoice details page
// TODO: In the invoice details page, show the payment history for that invoice (if any)
// TODO: Delete Cascade in prisma schema for customer -> invoices -> products and payments
// TODO: When deleting a customer, show a warning that all related invoices and payments will be deleted as well
// TODO:  In the products list page, show the total quantity sold for each product
// TODO: In the customers list page, show the total amount spent by each customer
// Check user creation flow and role assignment
