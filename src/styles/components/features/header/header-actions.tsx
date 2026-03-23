"use client";

import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

import HeaderCartDrawer from "../cart/header-cart-drawer";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useCartStore } from "stores/cart-store";
import HeaderWishlistDrawer from "../wishlist/header-wishlist-drawer";
import HeaderAvatar from "./header-avatar";
import { useWishlistStore } from "stores/wishlist-store";

export default function HeaderActions() {
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItemCount = useWishlistStore((state) => state.getItemCount());

  return (
    <div className="flex items-center gap-2">
      {/* Избранное */}
      <HeaderWishlistDrawer>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {wishlistItemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
            </Badge>
          )}
        </Button>
      </HeaderWishlistDrawer>

      {/* Корзина */}
      <HeaderCartDrawer />

      {/* Профиль */}
      <HeaderAvatar />
    </div>
  );
}
