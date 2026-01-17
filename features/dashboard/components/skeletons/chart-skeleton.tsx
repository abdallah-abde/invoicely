import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-35 h-5" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-30 h-4" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          <Skeleton className="w-70 h-5" />
        </div>
      </CardFooter>
    </Card>
  );
}
