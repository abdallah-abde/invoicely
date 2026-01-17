import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_STALE_TIME, DASHBOARD_GC_TIME } from "../charts.constants";

export function useRevenue(range: string) {
  return useQuery({
    queryKey: ["dashboard", "revenue", range],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/revenue?range=${range}`);
      if (!res.ok) throw new Error("Failed to load revenue");
      return res.json();
    },
    staleTime: DASHBOARD_STALE_TIME,
    placeholderData: (prev) => prev,
    gcTime: DASHBOARD_GC_TIME,
    enabled: !!range,
  });
}
