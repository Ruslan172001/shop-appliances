import type { IProduct } from "types";

interface ProductAttributesProps {
  product: IProduct;
}

export function ProductAttributes({ product }: ProductAttributesProps) {
  if (!product.model && !product.color && !product.country) {
    return null;
  }

  return (
    <div className="space-y-2 text-sm">
      {product.model && (
        <div className="flex gap-2">
          <span className="font-medium">Модель:</span>
          <span>{product.model}</span>
        </div>
      )}
      {product.color && (
        <div className="flex gap-2">
          <span className="text-muted-foreground">Цвет:</span>
          <span className="font-medium">{product.color}</span>
        </div>
      )}
      {product.country && (
        <div className="flex gap-2">
          <span className="text-muted-foreground">Страна:</span>
          <span className="font-medium">{product.country}</span>
        </div>
      )}
    </div>
  );
}
