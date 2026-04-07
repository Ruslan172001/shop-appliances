"use client";

import { useCart, useClearCart, useRemoveFromCart } from "@/hooks/use-cart";
import CartItemCard from "@/styles/components/features/cart/cart-item-card";
import { Button } from "@/styles/components/ui/button";
import { Separator } from "@/styles/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import { Input } from "@/styles/components/ui/input";

import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  Tag,
  Badge,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { SkeletonCartItem } from "@/styles/components/ui/skeleton/skeleton-cart-item";
import { useState } from "react";

export default function CartPage() {
  // Получаем данные и методы из стора
  const { data: items = [], isLoading } = useCart();
  const clearCartMutation = useClearCart();
  const removeFromCartMutation = useRemoveFromCart();
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedPromo?.discount || 0;
  const finalTotal = subtotal - discount;
  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCartMutation.mutate(productId, {
      onSuccess: () => toast.info(`"${productName}" удалён из корзины`),
    });
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    if (window.confirm("Вы уверены, что хотите очистить корзину")) {
      clearCartMutation.mutate(undefined, {
        onSuccess: () => toast.info("Корзина очищена"),
      });
    }
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    setIsCheckingPromo(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCodeInput.trim(),
          cartTotal: subtotal,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setAppliedPromo({ code: data.code, discount: data.discount });
      toast.success(
        `Промокод применён! Скидка: ${data.discount.toLocaleString()} ₽`,
      );
    } catch {
      toast.error("Ошибка проверки промокода");
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCartItem key={i} />
        ))}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-6">
          <div className="relative">
            <ShoppingCart className="h-32 w-32 text-muted-foreground opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/50">
                {itemCount}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Корзина пуста</h1>
            <p className="text-muted-foreground max-w-md">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
          </div>

          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/catalog">
              Перейти в каталог
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Корзина</h1>
        <Button
          variant="outline"
          onClick={handleClearCart}
          disabled={items.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Очистить корзину
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Товаров: {itemCount}</span>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.productId}
                item={item}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>
        </div>

        {/* Итоговая сумма */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Итого</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Промокод */}

              <div className="space-y-2">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm text-green-700">
                        {appliedPromo.code}
                      </span>
                      <Badge className="text-xs">
                        -{appliedPromo.discount.toLocaleString()} ₽
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Промокод"
                      value={promoCodeInput}
                      onChange={(e) =>
                        setPromoCodeInput(e.target.value.toUpperCase())
                      }
                      className="h-9"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={isCheckingPromo || !promoCodeInput.trim()}
                    >
                      {isCheckingPromo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "OK"
                      )}
                    </Button>
                  </form>
                )}
              </div>

              <Separator />

              {/* Сумма */}
              <div className="space-y-2">
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
                  <span>{finalTotal.toLocaleString()} ₽</span>
                </div>
              </div>

              {/* Кнопки */}
              <div className="space-y-2 pt-4">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    Оформить заказ
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/catalog">Продолжить покупки</Link>
                </Button>
              </div>

              {/* Информация */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4">
                <p>✓ Товары резервируются на 24 часа</p>
                <p>✓ Бесплатная доставка от 50 000 ₽</p>
                <p>✓ Гарантия на все товары</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
