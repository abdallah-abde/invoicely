import { useQuery } from "@tanstack/react-query";
import { GC_TIME } from "../charts.constants";

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: ["dashboard", "monthly-revenue"],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/monthly-revenue`);
      if (!res.ok) throw new Error("Failed to load monthly revenue");
      return res.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (prev) => prev,
    gcTime: GC_TIME,
  });
}
