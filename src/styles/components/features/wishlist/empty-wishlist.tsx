"use client";

import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/styles/components/ui/button";
import Link from "next/link";

export function EmptyWishlist() {
  return (
    <div className="container mx-auto py-8">
      <div
        className="flex flex-col items-center justify-center min-h-100 text-center space-y-6"
        role="status"
      >
        <Heart
          className="h-32 w-32 text-muted-foreground opacity-20"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Список желаний пуст</h1>
          <p className="text-muted-foreground max-w-md">
            Добавляйте понравившиеся товары, чтобы вернуться к ним позже
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/catalog">
            Перейти в каталог
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
