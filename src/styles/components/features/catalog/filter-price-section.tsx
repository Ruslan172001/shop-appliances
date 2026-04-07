"use client";

import { Slider } from "../../ui/slider";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { MAX_PRICE } from "@/lib/filter-utils";

interface FilterPriceSectionProps {
  priceRange: number[];
  onPriceChange: (range: number[]) => void;
}

export function FilterPriceSection({
  priceRange,
  onPriceChange,
}: FilterPriceSectionProps) {
  return (
    <div className="space-y-4">
      <Slider
        value={priceRange}
        min={0}
        max={MAX_PRICE}
        step={100}
        onValueChange={(value) => onPriceChange(value as [number, number])}
        className="mt-2"
      />
      <div className="flex items-center gap-2">
        <div className="space-y-1 flex-1">
          <Label htmlFor="filter-price-min">От</Label>
          <Input
            id="filter-price-min"
            type="number"
            value={priceRange[0]}
            onChange={(e) =>
              onPriceChange([
                parseInt(e.target.value) || 0,
                priceRange[1],
              ])
            }
            className="h-8"
          />
        </div>
        <div className="space-y-1 flex-1">
          <Label htmlFor="filter-price-max">До</Label>
          <Input
            id="filter-price-max"
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              onPriceChange([
                priceRange[0],
                parseInt(e.target.value) || MAX_PRICE,
              ])
            }
            className="h-8"
          />
        </div>
      </div>
      <div
        className="text-sm text-muted-foreground text-center"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {priceRange[0].toLocaleString()}-
        {priceRange[1].toLocaleString()} ₽
      </div>
    </div>
  );
}
