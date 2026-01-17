import { FormLabel } from "@/components/ui/form";
import { Asterisk } from "lucide-react";

export function CustomFormLabel({
  label,
  isRequired = false,
  children,
}: {
  label: string;
  isRequired?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <FormLabel className="flex gap-1 items-start">
      {label}
      {isRequired && <Asterisk className="size-2.5" />}
      {children}
    </FormLabel>
  );
}
