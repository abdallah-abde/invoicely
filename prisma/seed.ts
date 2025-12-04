import {
  PrismaClient,
  InvoiceStatus,
  UserRole,
} from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Website Maintenance",
        description: "Monthly website updates and technical support.",
        price: 300,
        unit: "month",
      },
      {
        name: "Cloud Hosting",
        description: "Cloud hosting package (1 month).",
        price: 150,
        unit: "month",
      },
      {
        name: "CRM Module",
        description: "Custom CRM module development.",
        price: 1200,
        unit: "project",
      },
      {
        name: "Software License",
        description: "Industrial software license for business usage.",
        price: 1000,
        unit: "license",
      },
      {
        name: "Technical Support",
        description: "Onsite or remote technical support.",
        price: 300,
        unit: "hour",
      },
      {
        name: "Mobile App UI Design",
        description: "Full UI/UX design package for mobile apps.",
        price: 800,
        unit: "project",
      },
      {
        name: "Logo & Branding Package",
        description: "Complete branding and logo design.",
        price: 500,
        unit: "project",
      },
      {
        name: "E-commerce Website",
        description: "Full e-commerce website built on Next.js/Shopify.",
        price: 2500,
        unit: "project",
      },
      {
        name: "SEO Optimization",
        description: "Complete SEO optimization package.",
        price: 600,
        unit: "project",
      },
      {
        name: "Social Media Management",
        description: "Monthly social media management & content creation.",
        price: 700,
        unit: "month",
      },
    ],
  });

  const allProducts = await prisma.product.findMany();

  // -----------------------
  // Customers
  // -----------------------
  await prisma.customer.createMany({
    data: [
      {
        name: "Ahmad Khartabeel",
        email: "contact@ahmad-tech.com",
        phone: "+963991112233",
        address: "Damascus, Abu Rummaneh",
        companyName: "Ahmad Tech",
        taxNumber: "123456789",
      },
      {
        name: "Al-Baraka Trading Co.",
        email: "info@albaraka-trade.com",
        phone: "+963944556677",
        address: "Aleppo, Sheikh Najjar Industrial City",
        companyName: "Al-Baraka Trading Co.",
        taxNumber: "987654321",
      },
      {
        name: "Nour Muneer",
        email: "support@noursoft.io",
        phone: "+963998887766",
        address: "Homs, Hamidiya",
        companyName: "Nour Software House",
        taxNumber: "1122334455",
      },
    ],
  });

  const customers = await prisma.customer.findMany();

  await prisma.user.createMany({
    data: [
      {
        email: "abdallah@gmail.com",
        name: "Abdallah",
        password: "password123",
        role: UserRole.ADMIN,
      },
    ],
  });

  const users = await prisma.user.findMany();

  // -----------------------
  // Invoices
  // -----------------------
  await prisma.invoice.createMany({
    data: [
      {
        number: "INV-001",
        customerId: customers[0].id,
        issuedAt: new Date("2025-01-05"),
        dueAt: new Date("2025-01-15"),
        status: InvoiceStatus.PAID,
        total: 450,
        notes: "Thank you for your business!",
        createdById: users[0].id,
      },
      {
        number: "INV-002",
        customerId: customers[0].id,
        issuedAt: new Date("2025-02-01"),
        dueAt: new Date("2025-02-10"),
        status: InvoiceStatus.SENT,
        total: 1200,
        notes: "Looking forward to working with you again.",
        createdById: users[0].id,
      },
      {
        number: "INV-003",
        customerId: customers[1].id,
        issuedAt: new Date("2025-03-12"),
        dueAt: new Date("2025-03-22"),
        status: InvoiceStatus.OVERDUE,
        total: 2300,
        notes: "Please remit payment at your earliest convenience.",
        createdById: users[0].id,
      },
    ],
  });

  const invoices = await prisma.invoice.findMany();

  // -----------------------
  // Invoice Items (linked to products)
  // -----------------------
  await prisma.invoiceProduct.createMany({
    data: [
      {
        invoiceId: invoices[0].id,
        productId: allProducts.find((p) => p.name === "Website Maintenance")!
          .id,
        quantity: 1,
        unitPrice: 300,
        totalPrice: 300,
      },
      {
        invoiceId: invoices[0].id,
        productId: allProducts.find((p) => p.name === "Cloud Hosting")!.id,
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
      },
      {
        invoiceId: invoices[1].id,
        productId: allProducts.find((p) => p.name === "CRM Module")!.id,
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200,
      },
      {
        invoiceId: invoices[2].id,
        productId: allProducts.find((p) => p.name === "Software License")!.id,
        quantity: 2,
        unitPrice: 1000,
        totalPrice: 2000,
      },
      {
        invoiceId: invoices[2].id,
        productId: allProducts.find((p) => p.name === "Technical Support")!.id,
        quantity: 1,
        unitPrice: 300,
        totalPrice: 300,
      },
    ],
  });

  console.log(
    "🌱 Seeded successfully with products, customers, invoices, and items!"
  );
}

main();
