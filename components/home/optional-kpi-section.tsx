import { Suspense } from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { getHomeKPIs } from "@/lib/get-home-kpis";
import { cn } from "@/lib/utils";

import OptionalKPISkeleton from "@/components/home/optional-kpi-skeleton";
import OptionalKPIContent from "@/components/home/optional-kpi-content";
import { buttonVariants } from "@/components/ui/button";

export const revalidate = 60 * 60; // 1 hour

export default async function OptionalKPISection() {
  const data = await getHomeKPIs();

  return (
    <section className="mx-auto pt-24 select-none max-w-5xl px-6" id="kpi">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">At-a-glance business insights</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Get a quick overview of your business performance with key metrics
          that matter most. These numbers update automatically and reflect your
          current momentum.
        </p>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Dive deeper into detailed analytics and reports inside the dashboard
          to explore trends, compare periods, and make informed decisions with
          confidence.
        </p>
      </div>
      <Suspense fallback={<OptionalKPISkeleton />}>
        <OptionalKPIContent data={data} />
      </Suspense>
      <div className="mt-10 flex justify-center">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "text-[16px]",
            "group transition duration-300"
          )}
        >
          View dashboard
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-300" />
        </Link>
      </div>
    </section>
  );
}
