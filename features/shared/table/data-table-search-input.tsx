"use client";

import { Input } from "@/components/ui/input";

export default function DataTableSearchInput({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Input
      placeholder="Search all fields..."
      value={globalFilter ?? ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="max-w-sm"
    />
  );
}
