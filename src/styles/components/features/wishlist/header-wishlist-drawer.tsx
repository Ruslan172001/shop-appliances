"use client";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useWishlistStore } from "stores/wishlist-store";
import { useCartStore } from "stores/cart-store";
import { toast } from "sonner";
import { IWishlistItem } from "types";

interface HeaderWishlistDrawerProps {
  children: React.ReactNode;
}
export default function HeaderWishlistDrawer({
  children,
}: HeaderWishlistDrawerProps) {
  const items = useWishlistStore((state) => state.items);
  const itemCount = useWishlistStore((state) => state.getItemCount());
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  const addItem = useCartStore((state) => state.addItem);
  const hadleMoveToCart = (item: IWishlistItem) => {
    addItem({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      oldPrice: item.oldPrice,
      image: item.image,
      inStock: item.inStock,
    });
    removeItem(item.productId);
    toast.success("Товар перемещён в корзину");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Избранное ({itemCount})</SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? "Ваш список избранного пуст" : ""}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
