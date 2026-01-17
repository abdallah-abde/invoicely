import { useSearchParams } from "next/navigation";
import { LAST_7_DAYS_VALUE } from "../../charts.constants";
import { useTopCustomers } from "../../hooks/use-top-customers";
import ChartSkeleton from "../skeletons/chart-skeleton";
import { TopCustomersChart } from "../charts/top-customers-chart";
import ChartFetchingSpinner from "../skeletons/chart-fetching-spinner";

export default function TopCustomersWrapper() {
  const params = useSearchParams();
  const range = params.get("range") ?? LAST_7_DAYS_VALUE;

  const { data, isFetching, isLoading } = useTopCustomers(range);

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="relative">
      {isFetching && <ChartFetchingSpinner />}

      <TopCustomersChart data={data ?? []} isFetching={isFetching} />
    </div>
  );
}
