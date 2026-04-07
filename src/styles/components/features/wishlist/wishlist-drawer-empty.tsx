"use client";

import { Heart } from "lucide-react";
import { SheetClose } from "../../ui/sheet";
import { Button } from "../../ui/button";
import Link from "next/link";

export function WishlistDrawerEmpty() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4"
      role="status"
    >
      <Heart className="h-16 w-16 mb-4 opacity-20" aria-hidden="true" />
      <p>Добавьте товары в избранное</p>
      <SheetClose asChild>
        <Button variant="link" className="mt-2" asChild>
          <Link href="/catalog">Перейти в каталог</Link>
        </Button>
      </SheetClose>
    </div>
  );
}
