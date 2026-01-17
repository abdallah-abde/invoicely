import { useSearchParams } from "next/navigation";
import { LAST_7_DAYS_VALUE } from "../../charts.constants";
import { useStatus } from "../../hooks/use-status";
import { InvoiceStatusChart } from "../charts/invoice-status-chart";
import ChartSkeleton from "../skeletons/chart-skeleton";
import { Loader2 } from "lucide-react";
import ChartFetchingSpinner from "../skeletons/chart-fetching-spinner";

export default function InvoiceStatusWrapper() {
  const params = useSearchParams();
  const range = params.get("range") ?? LAST_7_DAYS_VALUE;

  const { data, isFetching, isLoading } = useStatus(range);

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="relative">
      {isFetching && <ChartFetchingSpinner />}

      <InvoiceStatusChart data={data ?? []} />
    </div>
  );
}
