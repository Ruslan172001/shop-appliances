import type { OrderStatus } from "@/types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Ожидает оплаты",
  PAID: "Оплачен",
  PROCESSING: "Обрабатывается",
  SHIPPED: "Отправлен",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
};

export const orderStatusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500",
  PAID: "bg-blue-500",
  PROCESSING: "bg-purple-500",
  SHIPPED: "bg-indigo-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
};
