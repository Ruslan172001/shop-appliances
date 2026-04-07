"use client";

import type { IProduct } from "types";
import { ProductTitleSection } from "./product-title-section";
import { ProductPriceDisplay } from "./product-price-display";
import { ProductAttributes } from "./product-attributes";
import { ProductActions } from "./product-actions";
import { ProductDeliveryInfo } from "./product-delivery-info";

interface ProductInfoProps {
  product: IProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <ProductTitleSection product={product} />
      <ProductPriceDisplay product={product} />
      <div>
        <h3 className="font-semibold mb-2">Описание</h3>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>
      <ProductAttributes product={product} />
      <ProductActions product={product} />
      <ProductDeliveryInfo />
    </div>
  );
}
