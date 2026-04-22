import { Badge } from "../../ui/badge";
import { StarRating } from "../../shared/star-rating";
import {
  calculateDiscountPercent,
  isInStock,
} from "@/styles/lib/product-utils";
import type { IProduct } from "types";

interface ProductTitleSectionProps {
  product: IProduct;
}

export function ProductTitleSection({ product }: ProductTitleSectionProps) {
  const discount = calculateDiscountPercent(
    product.oldPrice ?? null,
    product.price,
  );
  const inStock = isInStock(product.quantity);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <div className="flex items-center gap-2 flex-wrap">
        {discount > 0 && (
          <Badge
            className="bg-red-500"
            aria-label={`Скидка ${discount} процентов`}
          >
            -{discount}%
          </Badge>
        )}
        <Badge
          className={inStock ? "bg-green-500" : ""}
          variant={inStock ? "default" : "destructive"}
        >
          {inStock ? "В наличии" : "Нет в наличии"}
        </Badge>
      </div>
      {product.rating && product.rating > 0 && (
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-sm text-gray-500">
            ({product.rating.toFixed(1)})
          </span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} отзывов)
          </span>
        </div>
      )}
    </div>
  );
}
