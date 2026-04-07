import { useQuery } from "@tanstack/react-query";
import { IOrder, IOrderItem } from "@/types";
import { DEFAULT_STALE_TIME } from "@/lib/query-constants";
interface OrderWithItems extends IOrder {
  items: IOrderItem[];
}

async function fetchUserOrders(): Promise<OrderWithItems[]> {
  const res = await fetch("/api/user/orders");
  if (!res.ok) throw new Error("Не удалось загрузить заказы");
  return res.json();
}

export function useUserOrders() {
  return useQuery({
    queryKey: ["user-orders"],
    queryFn: fetchUserOrders,
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}
