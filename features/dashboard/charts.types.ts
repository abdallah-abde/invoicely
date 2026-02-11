import { InvoiceStatus } from "@/app/generated/prisma/enums";

export interface RevenueByDayProps {
  date: string;
  revenue: number;
}

export interface InvoiceByStatusProps {
  status: string;
  _count: { status: number };
}

export interface TopCustomerProps {
  name: string;
  total: number;
  customerId: string;
}

export interface TopProductProps {
  name: string;
  total: number;
  quantity: number;
  price: number;
  productId: string;
}

export interface NewCustomerCountProps {
  date: string;
  count: number;
}

export interface MonthlyRevenueProps {
  month: string;
  revenue: number;
}

export interface DashboardChartsData {
  revenueByDay: RevenueByDayProps[];
  invoicesByStatus: InvoiceByStatusProps[];
  totalRevenue: number;
  paidInvoices: number;
  overdueInvoices: number;
  customersCount: number;
  topCustomers: TopCustomerProps[];
  topProducts: TopProductProps[];
  newCustomersCount: NewCustomerCountProps[];
  monthlyRevenue: MonthlyRevenueProps[];
}

export interface DashboadKPIs {
  totalRevenue: number;
  paidInvoices: number;
  overdueInvoices: number;
  customersCount: number;
}

export const STATUS_COLOR_MAP: Record<InvoiceStatus, string> = {
  DRAFT: "var(--chart-1)",
  SENT: "var(--chart-2)",
  PAID: "var(--chart-3)",
  OVERDUE: "var(--chart-4)",
  CANCELED: "var(--chart-5)",
  PARTIAL_PAID: "var(--primary)",
};
