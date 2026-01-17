import { useQuery } from "@tanstack/react-query";

export function useDashboard(range: string) {
  return useQuery({
    queryKey: ["dashboard", range],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard?range=${range}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 60_000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
}
