import { Suspense } from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { getHomeKPIs } from "@/features/charts/services/chart.services";
import { cn } from "@/lib/utils";

import OptionalKPISkeleton from "@/features/home/components/optional-kpi-skeleton";
import OptionalKPIContent from "@/features/home/components/optional-kpi-content";
import { buttonVariants } from "@/components/ui/button";

export const revalidate = 60 * 60; // 1 hour

export default async function OptionalKPISection() {
  const data = await getHomeKPIs();

  return (
    <section className="mx-auto pt-24 select-none max-w-5xl px-6" id="kpi">
      <div className="mb-12 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl  font-bold">
          At-a-glance business insights
        </h2>
        <p className="mt-4 max-w-md md:max-w-lg lg:max-w-2xl mx-auto text-muted-foreground text-sm md:text-[16px] lg:text-lg">
          Get a quick overview of your business performance with key metrics
          that matter most. These numbers update automatically and reflect your
          current momentum.
        </p>
      </div>
      {/* <Suspense fallback={<OptionalKPISkeleton />}> */}
      <OptionalKPIContent data={data} />
      {/* </Suspense> */}
      <p className="max-w-md md:max-w-lg lg:max-w-2xl mx-auto text-muted-foreground text-sm md:text-[16px] lg:text-lg text-center mt-12">
        Dive deeper into detailed analytics and reports inside the dashboard to
        explore trends, compare periods, and make informed decisions with
        confidence.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "text-sm lg:text-[17px]",
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
