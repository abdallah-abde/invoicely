export interface RevenueByDayProps {
  date: string;
  revenue: number;
}

export interface InvoiceByStatusProps {
  status: string;
  count: number;
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
