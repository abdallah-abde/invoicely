import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";

export function CustomFormLabel({
  label,
  isRequired = false,
  className,
  children,
}: {
  label: string;
  isRequired?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <FormLabel className={cn("flex gap-1 items-start", className)}>
      {label}
      {isRequired && <Asterisk className="size-2.5" />}
      {children}
    </FormLabel>
  );
}
