import { RevenueChart } from "@/components/charts/revenue-chart";
import DashboardFilters from "@/components/charts/dashboard-filters";
import KpiCards from "@/components/charts/kpi-cards";
import { DashboardChartsData } from "@/lib/types/chart-types";
import { InvoiceStatusChart } from "@/components/charts/invoice-status-chart";
import { TopCustomersChart } from "@/components/charts/top-customers-chart";
import { TopProductsChart } from "@/components/charts/top-products-chart";
import { NewCustomersCountChart } from "@/components/charts/new-customers-count-chart";
import { MonthlyRevenueChart } from "@/components/charts/monthly-revenue-chart";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  searchParams: { range?: string };
};

export default async function DashboardPage({ searchParams }: Props) {
  const range = (await searchParams.range) || "7d";

  const res = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/dashboard?range=${range}`,
    {
      cache: "force-cache",
      next: { revalidate: 300 }, // 5 minutes
    }
  );

  if (!res.ok) throw new Error("Dashboard failed");

  const data: DashboardChartsData = await res.json();

  return (
    <ScrollArea className="h-[calc(100vh-75px)] pr-8">
      <div className="space-y-6 py-6">
        <KpiCards
          totalRevenue={data.totalRevenue}
          paidInvoices={data.paidInvoices}
          overdueInvoices={data.overdueInvoices}
          customersCount={data.customersCount}
        />
        <DashboardFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RevenueChart data={data.revenueByDay} />
          <InvoiceStatusChart data={data.invoicesByStatus} />
          <TopCustomersChart data={data.topCustomers} />
          <TopProductsChart data={data.topProducts} />
          <NewCustomersCountChart data={data.newCustomersCount} />
          <MonthlyRevenueChart data={data.monthlyRevenue} />
        </div>
      </div>
    </ScrollArea>
  );
}
