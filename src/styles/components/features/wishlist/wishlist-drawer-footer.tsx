"use client";

import { SheetClose } from "../../ui/sheet";
import { Button } from "../../ui/button";

export function WishlistDrawerFooter() {
  return (
    <div className="border-t p-4">
      <SheetClose asChild>
        <Button variant="outline" className="w-full">
          Продолжить покупки
        </Button>
      </SheetClose>
    </div>
  );
}
