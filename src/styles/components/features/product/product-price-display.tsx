import type { IProduct } from "types";

interface ProductPriceDisplayProps {
  product: IProduct;
}

export function ProductPriceDisplay({ product }: ProductPriceDisplayProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center baseline gap-3">
        <span className="text-4xl font-bold">
          {product.price.toLocaleString()} ₽
        </span>
        {product.oldPrice && (
          <span className="text-xl text-muted-foreground line-through">
            {product.oldPrice.toLocaleString()} ₽
          </span>
        )}
      </div>
    </div>
  );
}
