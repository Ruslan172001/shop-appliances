"use client";

import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";

interface FilterAvailabilitySectionProps {
  inStock: boolean;
  onStockChange: (checked: boolean) => void;
}

export function FilterAvailabilitySection({
  inStock,
  onStockChange,
}: FilterAvailabilitySectionProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="filter-in-stock"
        checked={inStock}
        onCheckedChange={(checked) => onStockChange(checked as boolean)}
      />
      <Label
        htmlFor="filter-in-stock"
        className="text-sm font-normal cursor-pointer"
      >
        Только в наличии
      </Label>
    </div>
  );
}
