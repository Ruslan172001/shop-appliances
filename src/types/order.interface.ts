export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
  email: string;
  paymentId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface IOrderSnapshot {
  id: string;
  orderId: string;
  items: IOrderItemSnapshot[];
  total: number;
  deliveryAddress: IDeliveryAddress;
  contactInfo: IContactInfo;
}

export interface IOrderItemSnapshot {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IDeliveryAddress {
  country: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
  postalCode?: string;
}

export interface IContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  comment?: string;
}

export interface ICreateOrderInput {
  items: { productId: string; quantity: number }[];
  deliveryAddress: IDeliveryAddress;
  contactInfo: IContactInfo;
  paymentMethod: "card" | "cash" | "online";
}
