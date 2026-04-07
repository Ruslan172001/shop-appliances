"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "../../ui/slider";
import { Separator } from "../../ui/separator";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Badge } from "../../ui/badge";
import { X } from "lucide-react";

import { StarRating } from "../../shared/star-rating";
import { MAX_PRICE } from "@/lib/filter-utils";
import { useCategories } from "@/hooks/use-category";
import { SkeletonCatalogFilters } from "../../ui/skeleton/skeleton-catalog-filters";
interface CatalogFiltersProps {
  className?: string;
}

export function CatalogFilters({ className }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories = [], isLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "",
  );
  const [priceRange, setPriceRange] = useState<number[]>([0, MAX_PRICE]);
  const [inStock, setInStock] = useState<boolean>(
    searchParams.get("inStock") === "true",
  );
  const [minRating, setMinRating] = useState<number>(
    searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : 0,
  );

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < MAX_PRICE)
      params.set("maxPrice", priceRange[1].toString());
    if (inStock) params.set("inStock", "true");
    if (minRating > 0) params.set("rating", minRating.toString());
    router.push(`/catalog?${params.toString()}`);
  };

  if (isLoading) {
    return <SkeletonCatalogFilters />;
  }

  const resetFilters = () => {
    setSelectedCategory("");
    setInStock(false);
    setPriceRange([0, MAX_PRICE]);
    setMinRating(0);
    router.push("/catalog");
  };
  const hasActiveFilters =
    selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < MAX_PRICE ||
    inStock ||
    minRating > 0;
  return (
    <div className={`space-y-4 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Сбросить фильтры
          </Button>
        )}
      </div>
      <Separator />
      <Accordion
        type="multiple"
        defaultValue={["category", "price", "rating", "availability"]}
      >
        <AccordionItem value="category">
          <AccordionTrigger>Категория</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-3 min-w-50 overflow-hidden">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategory === category.id}
                      onCheckedChange={(checked) => {
                        setSelectedCategory(checked ? category.id : "");
                      }}
                    />
                    <Label
                      className="text-sm font-normal cursor-pointer wrap-break-word"
                      htmlFor={category.id}
                    >
                      {category.name}{" "}
                    </Label>
                  </div>
                  {category.children?.map((child) => (
                    <div key={child.id} className="ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={child.id}
                          checked={selectedCategory === child.id}
                          onCheckedChange={(checked) => {
                            setSelectedCategory(checked ? child.id : "");
                          }}
                        />
                        <Label htmlFor={child.id}>{child.name}</Label>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Цена</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={MAX_PRICE}
                step={100}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
                className="mt-2"
              />
              <div className="flex items-center gap-2">
                <div className="space-y-1 flex-1">
                  <Label>От</Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        parseInt(e.target.value) || 0,
                        priceRange[1],
                      ])
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label>До</Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        parseInt(e.target.value) || MAX_PRICE,
                      ])
                    }
                    className="h-8"
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {priceRange[0].toLocaleString()}-
                {priceRange[1].toLocaleString()} ₽
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rating">
          <AccordionTrigger>Рейтинг</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={minRating === rating}
                    onCheckedChange={(checked) => {
                      setMinRating(checked ? rating : 0);
                    }}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-normal cursor-pointer flex items-center gap-1"
                  >
                    <StarRating rating={rating} size="sm" />
                    <span className="text-muted-foreground">
                      {rating} и выше
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="availability">
          <AccordionTrigger>Наличие</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={inStock}
                onCheckedChange={(checked) => setInStock(checked as boolean)}
              />
              <Label
                htmlFor="inStock"
                className="text-sm font-normal cursor-pointer"
              >
                Только в наличии
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator />
      <Button onClick={applyFilters} className="w-full">
        Применить
      </Button>
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1">
          {selectedCategory && (
            <Badge className="gap-1" variant="secondary">
              {categories.find((category) => category.id === selectedCategory)
                ?.name || "Категория"}
              <X className="h-4 w-4" onClick={() => setSelectedCategory("")} />
            </Badge>
          )}
          {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
            <Badge variant="secondary" className="gap-1">
              Цена: {priceRange[0]}-{priceRange[1]} ₽
              <X
                className="h-4 w-4"
                onClick={() => setPriceRange([0, MAX_PRICE])}
              />
            </Badge>
          )}
          {inStock && (
            <Badge variant="secondary" className="gap-1">
              В наличии
              <X className="h-4 w-4" onClick={() => setInStock(false)} />
            </Badge>
          )}
          {minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              Рейтинг:{minRating} и выше
              <X className="h-4 w-4" onClick={() => setMinRating(0)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
