import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import Image from "next/image";
import QuantityControl from "./quantity-control";
import type { ICartItem } from "types";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useUpdateCartItem } from "@/hooks/use-cart";
interface CartItemCardProps {
  item: ICartItem;
  onRemoveItem: (productId: string, productName: string) => void;
}

export default function CartItemCard({
  item,
  onRemoveItem,
}: CartItemCardProps) {
  const updateQuantity = useUpdateCartItem();
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Изображение */}
          <Link
            href={`/product/${item.slug}`}
            className="shrink-0 relative aspect-square w-20 rounded-md overflow-hidden bg-gray-100"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </Link>

          {/* Информация */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/product/${item.slug}`}
              className="font-medium hover:underline line-clamp-2 block"
            >
              {item.name}
            </Link>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-bold text-primary">
                {item.price.toLocaleString()} ₽
              </span>
              {item.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {item.oldPrice.toLocaleString()} ₽
                </span>
              )}
            </div>

            {!item.inStock && (
              <span className="text-xs text-destructive block mt-1">
                Нет в наличии
              </span>
            )}

            {/* Количество и удаление */}
            <div className="flex items-center justify-between mt-2">
              <QuantityControl
                quantity={item.quantity}
                onQuantityChange={(qty) =>
                  updateQuantity.mutate({
                    productId: item.productId,
                    quantity: qty,
                  })
                }
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item.productId, item.name)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
