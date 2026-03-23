"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Поиск товаров..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pr-10"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      <Button type="submit" size="icon" variant="ghost">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
