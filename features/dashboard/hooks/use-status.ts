import { useQuery } from "@tanstack/react-query";
import { GC_TIME, DASHBOARD_STALE_TIME } from "../charts.constants";

export function useStatus(range: string) {
  return useQuery({
    queryKey: ["dashboard", "status", range],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/status?range=${range}`);
      if (!res.ok) throw new Error("Failed to load invoice status");
      return res.json();
    },
    staleTime: DASHBOARD_STALE_TIME,
    placeholderData: (prev) => prev,
    gcTime: GC_TIME,
    enabled: !!range,
  });
}
