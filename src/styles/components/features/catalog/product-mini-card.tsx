import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { getMainImage } from "@/lib/product-utils";
import type { IProduct } from "@/types";

interface ProductMiniCardProps {
  product: IProduct;
}

export default function ProductMiniCard({ product }: ProductMiniCardProps) {
  const addToCart = useAddToCart();
  const mainImage = getMainImage(product.images);
  const handleToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate(
      {
        item: {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          oldPrice: product.oldPrice || 0,
          image: mainImage?.url || "",
          inStock: product.quantity > 0,
        },
      },
      {
        onSuccess: () => toast.success("Добавлено в корзину"),
        onError: () => toast.error("Ошибка при добавлении в корзину"),
      },
    );
  };
  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex gap-3 p-2 hover:bg-muted rounded-lg transition-colors group"
    >
      <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">
            Нет фото
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {product.category.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-sm">
            {product.price.toLocaleString("ru-RU")} ₽
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {product.oldPrice.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
      </div>
      <button
        onClick={handleToCart}
        className="self-center p-1.5 hover:bg-primary/10 rounded-full transition-colors"
      >
        <ShoppingCart className="h-4 w-4 text-muted-foreground hover:text-primary" />
      </button>
    </Link>
  );
}
