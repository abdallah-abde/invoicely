import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <div>
      <div className="pt-3 flex items-baseline justify-between gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="w-full">
        <div className="flex flex-row items-start justify-between gap-2 py-4">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-8 w-35" />
        </div>
        <div className="overflow-hidden rounded-md border">
          {/*TABLE*/}
          <div className="relative w-full overflow-x-auto">
            {/*TABLE HEADER*/}
            <div className="bg-accent/50 border-b">
              {/*TABLE HEADER Row*/}
              <div className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors flex items-center justify-around p-2">
                {/* TABLE HEADER CELLS */}
                <Skeleton className="h-5 w-35" />
                <Skeleton className="h-5 w-35" />
                <Skeleton className="h-5 w-35" />
                <Skeleton className="h-5 w-35" />
                <Skeleton className="h-5 w-35" />
                <Skeleton className="h-5 w-35" />
                <Skeleton className="h-5 w-35" />
              </div>
            </div>
            {/* TABLE BODY */}
            <div>
              {/* TABLE BODY ROWS */}
              {Array.from({ length: 10 }).map((row, idx) => (
                <div
                  key={idx}
                  className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors flex items-center justify-around p-2"
                >
                  {/* TABLE BODY CELLS */}
                  <Skeleton className="h-5 w-35" />
                  <Skeleton className="h-5 w-35" />
                  <Skeleton className="h-5 w-35" />
                  <Skeleton className="h-5 w-35" />
                  <Skeleton className="h-5 w-35" />
                  <Skeleton className="h-5 w-35" />
                  <Skeleton className="h-5 w-35" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* TABLE PAGINATION */}
        <div className="flex items-center justify-between py-2">
          <div className="hidden sm:block text-muted-foreground flex-1 text-sm">
            <Skeleton className="h-5 w-35" />
          </div>
          <div className="max-sm:w-full flex items-center justify-between space-x-6 lg:space-x-8">
            <div className="hidden sm:flex items-center space-x-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex items-center justify-center text-sm font-medium">
              <Skeleton className="h-5 w-45" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
