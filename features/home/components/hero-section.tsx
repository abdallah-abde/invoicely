"use client";

import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";

import { BarChart3, FileText, TrendingUp, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { heroIcons } from "@/features/home/lib/hero-icons";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section
      className="flex items-start justify-between mx-auto pt-12 mt-24 select-none max-w-5xl px-6"
      id="hero"
    >
      <div className="flex flex-col gap-12 justify-center lg:justify-start items-center lg:items-start mt-10 select-none w-full">
        <HeroText />
        <HeroCTA />
      </div>
      <HeroVisual />
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative h-[480px] w-full max-w-xl hidden lg:block">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-chart-1/10 via-chart-3/10 to-transparent blur-3xl" />

      {heroIcons.map(({ Icon, label, pos }, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <div
              className={`absolute ${pos} rounded-xl border bg-background/80 p-3 shadow-sm backdrop-blur transition duration-500 hover:scale-110`}
            >
              <Icon className="h-7 w-7 text-primary" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-sm">{label}</span>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function HeroText() {
  const shouldReduceMotion = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : 0.12,
          },
        },
      }}
    >
      <motion.h1
        variants={item}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold tracking-wider text-shadow-md text-center lg:text-left"
      >
        {process.env.NEXT_PUBLIC_APP_NAME}
      </motion.h1>

      <motion.p
        variants={item}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
        className={cn(
          "mt-10 text-lg md:text-2xl text-muted-foreground font-semibold text-center lg:text-left"
          // FOR WRITTER EFFECT
          // "border-r-3 border-muted-foreground writter w-full overflow-hidden whitespace-nowrap leading-10"
        )}
      >
        Your smart invoicing dashboard
      </motion.p>

      <motion.ul
        variants={item}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        className="mt-4 max-w-xl text-muted-foreground/75 text-shadow-sm p-0 m-0 text-sm space-y-3"
      >
        <motion.li
          variants={item}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          className="flex items-center justify-start gap-2"
        >
          <FileText
            className="text-primary-foreground bg-primary rounded-full p-1"
            size="24"
          />
          Create and manage invoices with ease
        </motion.li>
        <motion.li
          variants={item}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
          className="flex items-center justify-start gap-2"
        >
          <TrendingUp
            className="text-primary-foreground bg-primary rounded-full p-1"
            size="24"
          />
          Manage customers and products in one unified system
        </motion.li>
        <motion.li
          variants={item}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
          className="flex items-center justify-start gap-2"
        >
          <Users
            className="text-primary-foreground bg-primary rounded-full p-1"
            size="24"
          />
          Track payments, revenue, and monthly growth
        </motion.li>
        <motion.li
          variants={item}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
          className="flex items-center justify-start gap-2"
        >
          <BarChart3
            className="text-primary-foreground bg-primary rounded-full p-1"
            size="24"
          />
          Visualize your business with real-time charts and KPIs
        </motion.li>
      </motion.ul>
    </motion.div>
  );
}

function HeroCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : 1,
        ease: "easeOut",
      }}
      className="flex flex-col sm:flex-row items-center gap-4"
    >
      <motion.div
        // whileHover={reduceMotion ? {} : { scale: 1.01 }}
        whileTap={reduceMotion ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "text-sm lg:text-[17px]"
          )}
        >
          Go to your dashboard
        </Link>
      </motion.div>
      <span className="text-sm lg:text-[17px]">or</span>
      <motion.div
        // whileHover={reduceMotion ? {} : { scale: 1.01 }}
        whileTap={reduceMotion ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "text-sm lg:text-[17px]"
          )}
        >
          Sign up
        </Link>
      </motion.div>
    </motion.div>
  );
}
