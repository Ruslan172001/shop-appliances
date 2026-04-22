"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/components/ui/select";
import { Label } from "@/styles/components/ui/label";
import { Checkbox } from "@/styles/components/ui/checkbox";

interface CategoryWithChildren {
  id: string;
  name: string;
  children?: CategoryWithChildren[];
}

interface ProductFiltersProps {
  categories: CategoryWithChildren[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  inStock: boolean;
  onInStockChange: (checked: boolean) => void;
}
export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  inStock,
  onInStockChange,
}: ProductFiltersProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground whitespace-nowrap">
          Категория:
        </Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-50 h-8 " aria-label="Выбрать категорию">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="admin-product-inStock"
          checked={inStock}
          onCheckedChange={(checked) => onInStockChange(!!checked)}
        />
        <Label
          htmlFor="admin-product-inStock"
          className="text-sm cursor-pointer"
        >
          Только в наличии
        </Label>
      </div>
    </div>
  );
}
