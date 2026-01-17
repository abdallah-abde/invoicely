import ChartSkeleton from "../skeletons/chart-skeleton";
import { useMonthlyRevenue } from "../../hooks/use-monthly-revenue";
import { MonthlyRevenueChart } from "../charts/monthly-revenue-chart";
import ChartFetchingSpinner from "../skeletons/chart-fetching-spinner";

export default function MonthlyRevenueWrapper() {
  const { data, isFetching, isLoading } = useMonthlyRevenue();

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="relative">
      {isFetching && <ChartFetchingSpinner />}

      <MonthlyRevenueChart data={data ?? []} isFetching={isFetching} />
    </div>
  );
}
