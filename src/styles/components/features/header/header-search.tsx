"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useSearch } from "@/hooks/use-search";
import { useClickOutside } from "@/hooks/use-click-outside";
import SearchResultDropdown from "./search-result-dropdown";
import { Input } from "../../ui/input";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { results, isLoading } = useSearch(query);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
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
  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Поиск товаров..."
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            className={query ? "w-full pr-20" : "w-full pr-10"}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </form>

      <SearchResultDropdown
        results={results}
        isLoading={isLoading}
        isOpen={isOpen}
        query={query}
      />
    </div>
  );
}
