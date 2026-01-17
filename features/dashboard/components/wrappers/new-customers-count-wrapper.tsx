import { useSearchParams } from "next/navigation";
import { LAST_7_DAYS_VALUE } from "../../charts.constants";
import { useNewCustomersCount } from "../../hooks/use-new-customers-count";
import ChartSkeleton from "../skeletons/chart-skeleton";
import { NewCustomersCountChart } from "../charts/new-customers-count-chart";
import ChartFetchingSpinner from "../skeletons/chart-fetching-spinner";

export default function NewCustomersCountWrapper() {
  const params = useSearchParams();
  const range = params.get("range") ?? LAST_7_DAYS_VALUE;

  const { data, isFetching, isLoading } = useNewCustomersCount(range);

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="relative">
      {isFetching && <ChartFetchingSpinner />}

      <NewCustomersCountChart data={data ?? []} isFetching={isFetching} />
    </div>
  );
}
