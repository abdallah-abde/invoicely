import { LucideIcon } from "lucide-react";

export interface OptionalKPIProps {
  data: {
    revenue: number;
    revenueDelta: number | null;
    customers: number;
    customersDelta: number | null;
    topProduct: { productId: string; quantity: number } | null;
  };
}

export interface KPIProps {
  icon: LucideIcon;
  value: number;
  prefix?: string;
  suffix?: string;
  delta?: number | null;
  isCurrency?: boolean;
  title: string;
}
