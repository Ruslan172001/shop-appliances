"use client";

import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";

interface CategoryWithChildren {
  id: string;
  name: string;
  children?: CategoryWithChildren[];
}

interface FilterCategorySectionProps {
  categories: CategoryWithChildren[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function FilterCategorySection({
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterCategorySectionProps) {
  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-3 min-w-50 overflow-hidden">
      {categories.map((category) => (
        <div key={category.id} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={selectedCategory === category.id}
              onCheckedChange={(checked) => {
                onCategoryChange(checked ? category.id : "");
              }}
            />
            <Label
              className="text-sm font-normal cursor-pointer wrap-break-word"
              htmlFor={category.id}
            >
              {category.name}
            </Label>
          </div>
          {category.children?.map((child) => (
            <div key={child.id} className="ml-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={child.id}
                  checked={selectedCategory === child.id}
                  onCheckedChange={(checked) => {
                    onCategoryChange(checked ? child.id : "");
                  }}
                />
                <Label htmlFor={child.id}>{child.name}</Label>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
