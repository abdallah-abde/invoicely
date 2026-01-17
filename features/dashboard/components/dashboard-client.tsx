"use client";

import DashboardFilters from "./dashboard-filters";
import KpisWrapper from "./wrappers/kpis-wrapper";
import RevenueChartWrapper from "./wrappers/revenue-chart-wrapper";
import InvoiceStatusWrapper from "./wrappers/invoice-status-wrapper";
import { Suspense } from "react";
import TopCustomersWrapper from "./wrappers/top-customers-wrapper";
import ChartSkeleton from "./skeletons/chart-skeleton";
import TopProductsWrapper from "./wrappers/top-products-wrapper";
import NewCustomersCountWrapper from "./wrappers/new-customers-count-wrapper";
import MonthlyRevenueWrapper from "./wrappers/monthly-revenue-wrapper";
import KpisSkeleton from "./skeletons/kpis-skeleton";

export default function DashboardClient() {
  return (
    <>
      <DashboardFilters />

      <Suspense fallback={<KpisSkeleton />}>
        <KpisWrapper />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChartWrapper />
        <InvoiceStatusWrapper />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <TopCustomersWrapper />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <TopProductsWrapper />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NewCustomersCountWrapper />
        <MonthlyRevenueWrapper />
      </div>
    </>
  );
}
