import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import { Badge } from "@/styles/components/ui/badge";
import { Button } from "@/styles/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/user-utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает оплаты",
  PAID: "Оплачен",
  PROCESSING: "Обрабатывается",
  SHIPPED: "Отправлен",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  PAID: "bg-green-500",
  PROCESSING: "bg-purple-500",
  SHIPPED: "bg-indigo-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

// Проверяем статус платежа через API ЮKassa
async function checkPaymentStatus(paymentId: string): Promise<boolean> {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) return false;

  try {
    const response = await fetch(
      `https://api.yookassa.ru/v3/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        },
      },
    );

    if (!response.ok) return false;

    const payment = await response.json();
    return payment.status === "succeeded";
  } catch {
    return false;
  }
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  // Если заказ не оплачен но есть paymentId — проверяем через API ЮKassa
  if (order.status !== "PAID" && order.paymentId) {
    const isPaid = await checkPaymentStatus(order.paymentId);
    if (isPaid) {
      await prisma.order.update({
        where: { id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      // Перезагружаем заказ с обновлённым статусом
      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (updatedOrder) {
        Object.assign(order, updatedOrder);
      }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Заказ #{order.id.slice(-8).toUpperCase()}
      </h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Информация о заказе</CardTitle>
            <Badge className={statusColors[order.status] || "bg-gray-500"}>
              {statusLabels[order.status] || order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Дата:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Адрес:</span>
              <span>{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Телефон:</span>
              <span>{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{order.email}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Итого:</span>
              <span>{Number(order.total).toLocaleString()} ₽</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Товары:</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-2">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {Number(item.price).toLocaleString()} ₽
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button asChild>
              <Link href="/profile">Мои заказы</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/catalog">Продолжить покупки</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
