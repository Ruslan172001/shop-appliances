"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, FormEvent } from "react";
import { useSearch } from "@/hooks/use-search";
import { useClickOutside } from "@/hooks/use-click-outside";
import SearchResultDropdown from "./search-result-dropdown";
import { Input } from "../../ui/input";
import { useRouter } from "next/navigation";

const SEARCH_RESULTS_ID = "search-results-list";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isLoading } = useSearch(query);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const totalResults = results.products.length + results.categories.length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
    if (value.trim().length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    if (query.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  // Клавиатурная навигация по результатам поиска
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || totalResults === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < totalResults - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalResults - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const activeElement = document.getElementById(
        `search-result-${activeIndex}`,
      );
      activeElement?.click();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Поиск товаров
          </label>
          <Input
            ref={inputRef}
            id="search-input"
            type="text"
            placeholder="Поиск товаров..."
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={SEARCH_RESULTS_ID}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
            }
            className={query ? "w-full pr-20" : "w-full pr-10"}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Очистить поиск"
              title="Очистить поиск"
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
            >
              <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </button>
          )}
          <Search
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </form>

      <SearchResultDropdown
        results={results}
        isLoading={isLoading}
        isOpen={isOpen}
        query={query}
        activeIndex={activeIndex}
        dropdownId={SEARCH_RESULTS_ID}
      />
    </div>
  );
}
