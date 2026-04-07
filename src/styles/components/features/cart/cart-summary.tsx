"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/styles/components/ui/button";
import { Separator } from "@/styles/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import { CartPromoSection } from "./cart-promo-section";
import type { ICartItem } from "@/types/cart.interface";
import { useState } from "react";

interface PromoResult {
  code: string;
  discount: number;
}

interface CartSummaryProps {
  items: ICartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const [promo, setPromo] = useState<PromoResult | null>(null);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = promo?.discount || 0;
  const finalTotal = subtotal - discount;

  const handlePromoApplied = (promoResult: PromoResult) => {
    setPromo(promoResult);
  };

  const handlePromoRemoved = () => {
    setPromo(null);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Итого</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Промокод */}
        <div className="space-y-2">
          <CartPromoSection
            cartSubtotal={subtotal}
            onPromoApplied={handlePromoApplied}
            onPromoRemoved={handlePromoRemoved}
          />
        </div>

        <Separator />

        {/* Сумма */}
        <div className="space-y-2">
          <div
            className="flex justify-between text-sm"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="text-muted-foreground">
              Товаров: {itemCount}
            </span>
            <span>Подытог</span>
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
            <span>{finalTotal.toLocaleString()} ₽</span>
          </div>
        </div>

        {/* Кнопки */}
        <div className="space-y-2 pt-4">
          <Button asChild className="w-full" size="lg">
            <a href="/checkout">
              Оформить заказ
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <a href="/catalog">Продолжить покупки</a>
          </Button>
        </div>

        {/* Информация */}
        <div
          className="text-xs text-muted-foreground space-y-1 pt-4"
          role="contentinfo"
        >
          <p>✓ Товары резервируются на 24 часа</p>
          <p>✓ Бесплатная доставка от 50 000 ₽</p>
          <p>✓ Гарантия на все товары</p>
        </div>
      </CardContent>
    </Card>
  );
}
