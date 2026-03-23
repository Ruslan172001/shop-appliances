import { IOrder } from "./order.interface";
import { IProduct } from "./product.interface";

export interface IAnalyticsDashboard {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: IOrder[];
  lowStockProducts: IProduct[];
  revenueChart: IRevenueDataPoint[];
}

export interface IRevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface IProductStats {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
}

export interface IOrderStats {
  totalOrders: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}
