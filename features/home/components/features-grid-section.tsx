"use client";

import {
  BarChart3,
  FileText,
  LucideIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Invoice Management",
    description:
      "Create, edit, and manage invoices with ease. Track status, due dates, and payments in one workflow.",
  },
  {
    icon: TrendingUp,
    title: "Payments & Revenue",
    description:
      "Monitor payments, monthly revenue, and growth trends with clear financial insights.",
  },
  {
    icon: Users,
    title: "Customers & Products",
    description:
      "Manage customers and products in one unified system and keep all business data connected.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Visualize your business performance with real-time charts, KPIs, and comparisons.",
  },
];

export default function FeaturesGridSection() {
  return (
    <section className="mx-auto pt-24 select-none max-w-5xl px-6" id="features">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">
          Everything you need to run your invoicing workflow
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Manage invoices, customers, products, and payments from a single,
          intuitive dashboard designed for clarity and growth.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      className="
        group relative rounded-xl border p-6
        bg-background
        transition
        duration-500
        hover:shadow-md
        dark:hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
        dark:border-muted-foreground/10 hover:scale-110"
    >
      {/* Dark-mode gradient overlay */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-xl
          opacity-100 group-hover:opacity-50 
          transition
          duration-500
          bg-linear-to-br
          from-chart-2/10 via-chart-4/10 to-transparent dark:from-chart-2/15 dark:via-chart-4/15"
      />
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-[14px] dark:text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
