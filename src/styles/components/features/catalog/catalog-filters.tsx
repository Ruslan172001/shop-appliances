"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { useCategories } from "@/hooks/use-category";
import { MAX_PRICE } from "@/lib/filter-utils";
import { SkeletonCatalogFilters } from "../../ui/skeleton/skeleton-catalog-filters";
import { FilterCategorySection } from "./filter-category-section";
import { FilterPriceSection } from "./filter-price-section";
import { FilterRatingSection } from "./filter-rating-section";
import { FilterAvailabilitySection } from "./filter-availability-section";
import { ActiveFilterBadges } from "./active-filter-badges";

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

  if (isLoading) {
    return <SkeletonCatalogFilters />;
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            aria-label="Сбросить все фильтры"
          >
            <X className="mr-2 h-4 w-4" aria-hidden="true" />
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
            <FilterCategorySection
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Цена</AccordionTrigger>
          <AccordionContent>
            <FilterPriceSection
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rating">
          <AccordionTrigger>Рейтинг</AccordionTrigger>
          <AccordionContent>
            <FilterRatingSection
              minRating={minRating}
              onRatingChange={setMinRating}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="availability">
          <AccordionTrigger>Наличие</AccordionTrigger>
          <AccordionContent>
            <FilterAvailabilitySection
              inStock={inStock}
              onStockChange={setInStock}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator />
      <Button onClick={applyFilters} className="w-full">
        Применить
      </Button>
      {hasActiveFilters && (
        <ActiveFilterBadges
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          inStock={inStock}
          minRating={minRating}
          categories={categories}
          onClearCategory={() => setSelectedCategory("")}
          onClearPrice={() => setPriceRange([0, MAX_PRICE])}
          onClearStock={() => setInStock(false)}
          onClearRating={() => setMinRating(0)}
        />
      )}
    </div>
  );
}
