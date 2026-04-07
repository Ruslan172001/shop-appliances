"use client";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface CheckoutSuccessProps {
  orderId: string;
  discount?: number;
}

export function CheckoutSuccess({ orderId, discount }: CheckoutSuccessProps) {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Заказ оформлен!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ваш заказ оформлен, мы свяжемся с вами в ближайшее время
          </p>
          {discount && discount > 0 && (
            <p className="text-sm text-green-600 mt-2">
              Скидка по промокоду: {discount.toLocaleString()} ₽
            </p>
          )}
          <div className="flex gap-2 mt-4">
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
