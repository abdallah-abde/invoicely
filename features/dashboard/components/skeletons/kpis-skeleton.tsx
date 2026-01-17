import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function KpisSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-center justify-center sm:justify-between gap-6">
      {Array.from({ length: 4 }).map((a, idx) => (
        <Card key={idx}>
          <CardHeader className="flex items-center justify-between text-muted-foreground w-auto">
            <CardTitle className="text-sm">
              <Skeleton className="w-35 h-5" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-5 h-5 rounded-full" />
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-primary">
            <Skeleton className="h-10.5 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
