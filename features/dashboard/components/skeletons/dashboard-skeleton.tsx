import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    </div>
  );
}
