"use client";

import { Heart, ShoppingCart } from "lucide-react";

import HeaderCartDrawer from "../cart/header-cart-drawer";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import HeaderWishlistDrawer from "../wishlist/header-wishlist-drawer";
import HeaderAvatar from "./header-avatar";

// Функция для правильного склонения существительных
function pluralize(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export default function HeaderActions() {
  const { data: cartItems = [] } = useCart();
  const { data: wishlistItems = [] } = useWishlist();
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const wishlistItemCount = wishlistItems.length;

  const wishlistText = `${wishlistItemCount} ${pluralize(wishlistItemCount, "товар", "товара", "товаров")}`;
  const cartText = `${cartItemCount} ${pluralize(cartItemCount, "товар", "товара", "товаров")}`;

  return (
    <div className="flex items-center gap-2">
      {/* Live region для объявления изменений */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        В корзине {cartText}, в избранном {wishlistText}
      </div>

      {/* Избранное */}
      <HeaderWishlistDrawer>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Избранное, ${wishlistText}`}
        >
          <Heart className="h-5 w-5" aria-hidden="true" />
          {wishlistItemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              role="status"
            >
              <span className="sr-only">Количество:</span>
              {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
            </Badge>
          )}
        </Button>
      </HeaderWishlistDrawer>

      {/* Корзина */}
      <HeaderCartDrawer>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Корзина, ${cartText}`}
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          {cartItemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              role="status"
            >
              <span className="sr-only">Количество:</span>
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </Badge>
          )}
        </Button>
      </HeaderCartDrawer>

      {/* Профиль */}
      <HeaderAvatar />
    </div>
  );
}
