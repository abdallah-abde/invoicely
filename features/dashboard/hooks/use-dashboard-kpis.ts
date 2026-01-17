import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_STALE_TIME } from "../charts.constants";

export function useDashboardKpis(range: string) {
  return useQuery({
    queryKey: ["dashboard", "kpis", range],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/kpis?range=${range}`);
      if (!res.ok) throw new Error("Failed to load KPIs");
      return res.json();
    },
    staleTime: DASHBOARD_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    enabled: !!range,
  });
}
