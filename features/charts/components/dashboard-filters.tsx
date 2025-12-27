"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const ranges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last Month", value: "1m" },
  { label: "Last 3 Months", value: "3m" },
];

export default function DashboardFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const active = params.get("range") || "7d";

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {ranges.map((r) => (
        <Button
          key={r.value}
          variant={active === r.value ? "default" : "outline"}
          onClick={() => router.push(`?range=${r.value}`)}
        >
          {r.label}
        </Button>
      ))}
    </div>
  );
}
