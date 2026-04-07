"use client";

import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { CheckoutPromoInput } from "./checkout-promo-input";
import { ICartItem } from "@/types";
import { useState } from "react";

interface PromoResult {
  code: string;
  discount: number;
  finalAmount: number;
}

interface CheckoutOrderSummaryProps {
  items: ICartItem[];
  isPending: boolean;
}

export function CheckoutOrderSummary({
  items,
  isPending,
}: CheckoutOrderSummaryProps) {
  const [promo, setPromo] = useState<PromoResult | null>(null);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = promo?.discount || 0;
  const total = subtotal - discount;

  const handlePromoApplied = (promoResult: PromoResult) => {
    setPromo(promoResult);
  };

  const handlePromoRemoved = () => {
    setPromo(null);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Ваш заказ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span className="line-clamp-1 flex-1 mr-2">{item.name}</span>
            <span>×{item.quantity}</span>
            <span className="font-medium ml-2">
              {(item.price * item.quantity).toLocaleString()} ₽
            </span>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Подытог</span>
          <span>{subtotal.toLocaleString()} ₽</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Скидка</span>
            <span>-{discount.toLocaleString()} ₽</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Итого</span>
          <span>{total.toLocaleString()} ₽</span>
        </div>

        <CheckoutPromoInput
          cartSubtotal={subtotal}
          onPromoApplied={handlePromoApplied}
          onPromoRemoved={handlePromoRemoved}
        />

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "Оформление..." : "Оформить заказ"}
        </Button>
      </CardContent>
    </Card>
  );
}
