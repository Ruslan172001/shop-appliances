"use client";
import { Heart, ShoppingCart } from "lucide-react";
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
import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAddToCart } from "@/hooks/use-cart";
import { toast } from "sonner";

interface HeaderWishlistDrawerProps {
  children: React.ReactNode;
}
export default function HeaderWishlistDrawer({
  children,
}: HeaderWishlistDrawerProps) {
  // Wishlist методы
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
              <Heart className="h-5 w-5" />
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
          <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
            Загрузка...
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4">
            <Heart className="h-16 w-16 mb-4 opacity-20" />
            <p>Добавьте товары в избранное</p>
            <SheetClose asChild>
              <Button variant="link" className="mt-2">
                Перейти в каталог
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 p-2 border rounded-lg"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative w-20 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-medium text-sm line-clamp-2 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-sm">
                          {item.price.toLocaleString("ru-RU")} ₽
                        </span>
                        {item.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {item.oldPrice.toLocaleString("ru-RU")} ₽
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          disabled={!item.inStock}
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />В корзину
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleRemove(item.productId, item.name)
                          }
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="border-t p-4">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Продолжить покупки
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
