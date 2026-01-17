import { useSearchParams } from "next/navigation";
import { RevenueChart } from "../charts/revenue-chart";
import { LAST_7_DAYS_VALUE } from "../../charts.constants";
import { useRevenue } from "../../hooks/use-revenue";
import ChartSkeleton from "../skeletons/chart-skeleton";
import ChartFetchingSpinner from "../skeletons/chart-fetching-spinner";

export default function RevenueChartWrapper() {
  const params = useSearchParams();
  const range = params.get("range") ?? LAST_7_DAYS_VALUE;

  const { data, isFetching, isLoading } = useRevenue(range);

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="relative">
      {isFetching && <ChartFetchingSpinner />}

      <RevenueChart data={data ?? []} isFetching={isFetching} />
    </div>
  );
}
