"use client";

import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/styles/components/ui/button";
import Link from "next/link";

export function CartEmpty() {
  return (
    <div className="container mx-auto py-8">
      <div
        className="flex flex-col items-center justify-center min-h-100 text-center space-y-6"
        role="status"
      >
        <div className="relative">
          <ShoppingCart
            className="h-32 w-32 text-muted-foreground opacity-20"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/50">
              0
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
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
