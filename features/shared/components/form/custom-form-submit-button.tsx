import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export function CustomFormSubmitButton({
  label,
  isLoading,
  className,
}: {
  label: string;
  isLoading: boolean;
  className?: string;
}) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      size="lg"
      className={cn("w-fit cursor-pointer ms-auto", className)}
    >
      {isLoading ? <Loader className="animate-spin" /> : <>{label}</>}
    </Button>
  );
}
