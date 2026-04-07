"use client";

import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

import HeaderCartDrawer from "../cart/header-cart-drawer";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import HeaderWishlistDrawer from "../wishlist/header-wishlist-drawer";
import HeaderAvatar from "./header-avatar";

export default function HeaderActions() {
  const { data: cartItems = [] } = useCart();
  const { data: wishlistItems = [] } = useWishlist();
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const wishlistItemCount = wishlistItems.length;

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
      <HeaderCartDrawer>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
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
