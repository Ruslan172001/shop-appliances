import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";
import { Separator } from "@/styles/components/ui/separator";
import { ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import { createYooKassaPayment } from "@/actions/pay-yookassa";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPayPage({ params }: PageProps) {
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

  // Если заказ уже оплачен — редирект на страницу заказа
  if (order.status === "PAID") {
    redirect(`/order/${order.id}`);
  }

  let paymentUrl: string | null = null;
  let error: string | null = null;

  // Создаем платеж через экшен (единая точка логики оплаты)
  const paymentResult = await createYooKassaPayment(order.id);

  if (paymentResult.error) {
    error = paymentResult.error;
  } else {
    paymentUrl = paymentResult.confirmationUrl || null;
  }

  return (
    <div className="container mx-auto py-16 max-w-2xl">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-green-100 p-3 rounded-full">
          <ShieldCheck className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">
        Оплата заказа #{order.id.slice(-8).toUpperCase()}
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Безопасная оплата через ЮKassa
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Детали заказа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Статус</span>
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Ожидает оплаты
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="line-clamp-1 flex-1 mr-2">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {Number(item.price).toLocaleString()} ₽
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between text-xl font-bold">
            <span>Итого к оплате:</span>
            <span>{Number(order.total).toLocaleString()} ₽</span>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="font-medium mb-1">Ошибка оплаты</p>
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {paymentUrl ? (
          <a href={paymentUrl} target="_self">
            <Button className="w-full h-12 text-lg" size="lg">
              <Lock className="mr-2 h-5 w-5" />
              Перейти к оплате
            </Button>
          </a>
        ) : (
          !error && (
            <Button disabled className="w-full h-12 text-lg" size="lg">
              Загрузка...
            </Button>
          )
        )}

        <Button variant="outline" asChild className="w-full">
          <Link href={`/order/${order.id}`}>Вернуться к заказу</Link>
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Платежи защищены шифрованием ЮKassa</span>
      </div>
    </div>
  );
}
