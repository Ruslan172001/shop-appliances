"use client";

import { Heart } from "lucide-react";
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
import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAddToCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { WishlistDrawerItem } from "./wishlist-drawer-item";
import { WishlistDrawerEmpty } from "./wishlist-drawer-empty";
import { WishlistDrawerFooter } from "./wishlist-drawer-footer";

interface HeaderWishlistDrawerProps {
  children: React.ReactNode;
}

export default function HeaderWishlistDrawer({
  children,
}: HeaderWishlistDrawerProps) {
  const { data: items = [], isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const itemCount = items.length;

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist.mutate(productId, {
      onSuccess: () => toast.info(`"${productName}" удалён из избранного`),
    });
  };

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart.mutate(
      {
        item: {
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          price: item.price,
          oldPrice: item.oldPrice ? Number(item.oldPrice) : undefined,
          image: item.image,
          inStock: item.inStock,
        },
      },
      {
        onSuccess: () => {
          toast.success("Добавлено в корзину");
          handleRemove(item.productId, item.name);
        },
      },
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="border-b p-4 pb-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" aria-hidden="true" />
              Избранное ({itemCount})
            </SheetTitle>
          </div>
          <SheetDescription>
            {itemCount === 0
              ? "Ваш список избранного пуст"
              : "Товары, которые вы добавили"}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div
            className="flex-1 flex items-center justify-center text-muted-foreground p-4"
            role="status"
            aria-busy="true"
          >
            Загрузка...
          </div>
        ) : items.length === 0 ? (
          <WishlistDrawerEmpty />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <WishlistDrawerItem
                    key={item.productId}
                    productId={item.productId}
                    name={item.name}
                    slug={item.slug}
                    price={item.price}
                    oldPrice={item.oldPrice ? Number(item.oldPrice) : undefined}
                    image={item.image}
                    inStock={item.inStock}
                    onAddToCart={() => handleAddToCart(item)}
                    onRemove={() => handleRemove(item.productId, item.name)}
                  />
                ))}
              </div>
            </div>

            <SheetFooter className="border-t p-0">
              <WishlistDrawerFooter />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
