import { RevenueChart } from "@/features/charts/components/revenue-chart";
import DashboardFilters from "@/features/charts/components/dashboard-filters";
import KpiCards from "@/features/charts/components/kpi-cards";
import { DashboardChartsData } from "@/features/charts/charts.types";
import { InvoiceStatusChart } from "@/features/charts/components/invoice-status-chart";
import { TopCustomersChart } from "@/features/charts/components/top-customers-chart";
import { TopProductsChart } from "@/features/charts/components/top-products-chart";
import { NewCustomersCountChart } from "@/features/charts/components/new-customers-count-chart";
import { MonthlyRevenueChart } from "@/features/charts/components/monthly-revenue-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authSession } from "@/features/auth/lib/auth-utils";
import AccessDenied from "@/features/shared/components/access-denied";

type Props = {
  searchParams: Promise<{ range?: string }>;
};

export default async function DashboardHomePage({ searchParams }: Props) {
  const params = await searchParams;
  const range = params?.range || "7d"; // default to last 30 days

  const session = await authSession();

  if (!session || !session.user)
    return <div>Please log in to view the dashboard.</div>;

  if (session.user.role === "user")
    return (
      <AccessDenied
        errorName=""
        message="You are not allowed to view this page"
      />
    );

  const res = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/dashboard?range=${range}`,
    {
      // cache: "force-cache",
      // next: { revalidate: 300 }, // 5 minutes
    }
  );

  if (!res.ok) throw new Error("Dashboard failed");

  const data: DashboardChartsData = await res.json();

  return (
    <ScrollArea className="h-[calc(100vh-75px)] pr-6">
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
