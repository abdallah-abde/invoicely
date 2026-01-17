import { useSearchParams } from "next/navigation";
import KpisCards from "../charts/kpis-cards";
import { LAST_7_DAYS_VALUE } from "../../charts.constants";
import { useDashboardKpis } from "../../hooks/use-dashboard-kpis";
import KpisSkeleton from "../skeletons/kpis-skeleton";

export default function KpisWrapper() {
  const params = useSearchParams();
  const range = params.get("range") ?? LAST_7_DAYS_VALUE;

  const { data, isLoading } = useDashboardKpis(range);

  if (isLoading) return <KpisSkeleton />;

  return (
    <div className="relative">
      <KpisCards
        totalRevenue={data.totalRevenue}
        paidInvoices={data.paidInvoices}
        overdueInvoices={data.overdueInvoices}
        customersCount={data.customersCount}
      />
    </div>
  );
}
