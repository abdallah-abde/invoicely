import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_GC_TIME, DASHBOARD_STALE_TIME } from "../charts.constants";

export function useTopProducts(range: string) {
  return useQuery({
    queryKey: ["dashboard", "top-products", range],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/top-products?range=${range}`);
      if (!res.ok) throw new Error("Failed to load top products");
      return res.json();
    },
    staleTime: DASHBOARD_STALE_TIME,
    placeholderData: (prev) => prev,
    gcTime: DASHBOARD_GC_TIME,
    enabled: !!range,
  });
}
