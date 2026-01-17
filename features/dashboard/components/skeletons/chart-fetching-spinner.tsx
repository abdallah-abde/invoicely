"use client";

import { useArabic } from "@/hooks/use-arabic";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function ChartFetchingSpinner() {
  const isArabic = useArabic();
  return (
    <span
      className={cn(
        "text-xs opacity-60 absolute top-2",
        isArabic ? "left-2" : "right-2"
      )}
    >
      <Loader2 className="size-3 animate-spin" />
    </span>
  );
}
