"use client";
import { CreditCard, Banknote, Globe } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { createOrder, OrderFormState } from "@/actions/order";
import { Spinner } from "@/styles/components/ui/spinner";
import { Button } from "@/styles/components/ui/button";
import { Input } from "@/styles/components/ui/input";
import { Textarea } from "@/styles/components/ui/textarea";
import { Separator } from "@/styles/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import { Badge } from "@/styles/components/ui/badge";
import { Tag, Loader2, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface PromoResult {
  code: string;
  discount: number;
  finalAmount: number;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { data: items = [], isLoading } = useCart();
  const [state, formAction, isPending] = useActionState(
    createOrder,
    {} as OrderFormState,
  );

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoResult | null>(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  useEffect(() => {
    if (state?.confirmationUrl) {
      window.location.href = state.confirmationUrl;
    }
  }, [state?.confirmationUrl]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0 && !state?.orderId) {
    redirect("/cart");
  }

  if (state?.orderId && !state?.confirmationUrl) {
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
            {state.discount && state.discount > 0 && (
              <p className="text-sm text-green-600 mt-2">
                Скидка по промокоду: {state.discount.toLocaleString()} ₽
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

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = promo?.discount || 0;
  const total = subtotal - discount;

  const handleCheckPromo = async () => {
    if (!promoInput.trim()) return;

    setIsCheckingPromo(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim(), cartTotal: subtotal }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setPromo({
        code: data.code,
        discount: data.discount,
        finalAmount: data.finalAmount,
      });
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
    setPromo(null);
    setPromoInput("");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

      <form action={formAction}>
        <input type="hidden" name="userId" value={session?.user?.id || ""} />
        <input type="hidden" name="promoCode" value={promo?.code || ""} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Контактные данные */}
            <Card>
              <CardHeader>
                <CardTitle>Контактные данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Имя</label>
                    <Input type="text" name="firstName" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Фамилия</label>
                    <Input type="text" name="lastName" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" name="email" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Телефон</label>
                  <Input type="tel" name="phone" required />
                </div>
              </CardContent>
            </Card>

            {/* Адрес */}
            <Card>
              <CardHeader>
                <CardTitle>Адрес доставки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Город</label>
                  <Input type="text" name="city" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Адрес</label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Улица, дом, квартира"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Комментарий</label>
                  <Textarea name="comment" placeholder="Комментарий к заказу" />
                </div>
              </CardContent>
            </Card>

            {/* Оплата */}
            <Card>
              <CardHeader>
                <CardTitle>Способ оплаты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="relative flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent has-checked:border-primary has-checked:bg-accent">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    defaultChecked
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span className="font-medium">Картой при получении</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Оплата картой курьеру при доставке
                    </p>
                  </div>
                </label>
                <label className="relative flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent has-checked:border-primary has-checked:bg-accent">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      <span className="font-medium">
                        Наличными при получении
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Оплата наличными курьеру при доставке
                    </p>
                  </div>
                </label>
                <label className="relative flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent has-checked:border-primary has-checked:bg-accent">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">Онлайн оплата</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Оплата банковской картой через безопасный шлюз
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {state?.error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
                {state.error}
              </div>
            )}
          </div>

          {/* Итого */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <span className="line-clamp-1 flex-1 mr-2">
                      {item.name}
                    </span>
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

                {/* Промокод */}
                <div className="space-y-2 pt-2">
                  {promo ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm text-green-700">
                          {promo.code}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          -{promo.discount.toLocaleString()} ₽
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
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Промокод"
                        value={promoInput}
                        onChange={(e) =>
                          setPromoInput(e.target.value.toUpperCase())
                        }
                        className="h-9"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCheckPromo}
                        disabled={isCheckingPromo || !promoInput.trim()}
                      >
                        {isCheckingPromo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "OK"
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? "Оформление..." : "Оформить заказ"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
