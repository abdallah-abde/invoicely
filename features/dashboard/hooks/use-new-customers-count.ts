import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_GC_TIME, DASHBOARD_STALE_TIME } from "../charts.constants";

export function useNewCustomersCount(range: string) {
  return useQuery({
    queryKey: ["dashboard", "new-customers", range],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/new-customers?range=${range}`);
      if (!res.ok) throw new Error("Failed to load new customers count");
      return res.json();
    },
    staleTime: DASHBOARD_STALE_TIME,
    placeholderData: (prev) => prev,
    gcTime: DASHBOARD_GC_TIME,
    enabled: !!range,
  });
}
