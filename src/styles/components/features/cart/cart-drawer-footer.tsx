"use client";

import { SheetClose } from "../../ui/sheet";
import { Button } from "../../ui/button";
import Link from "next/link";

interface CartDrawerFooterProps {
  total: number;
}

export function CartDrawerFooter({ total }: CartDrawerFooterProps) {
  return (
    <div className="border-t p-4 space-y-3">
      <div
        className="flex justify-between items-center"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-sm font-medium">Итого:</span>
        <span className="text-lg font-bold">{total.toLocaleString()} ₽</span>
      </div>

      <div className="flex gap-2">
        <SheetClose asChild>
          <Button variant="outline" className="flex-1 py-2">
            Продолжить покупки
          </Button>
        </SheetClose>

        <Button asChild className="flex-1 py-2">
          <Link href="/cart">Перейти в корзину</Link>
        </Button>
      </div>
    </div>
  );
}
