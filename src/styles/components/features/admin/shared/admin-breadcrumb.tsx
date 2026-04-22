"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  admin: "Админ-панель",
  products: "Товары",
  orders: "Заказы",
  categories: "Категории",
  users: "Пользователи",
  settings: "Настройки",
  reviews: "Отзывы",
  "promo-codes": "Промокоды",
  create: "Создать",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/admin" className="hover:text-foreground">
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Админ-панель</span>
          </Link>
        </li>
        {segments.slice(1).map((segment, index) => {
          if (segment === "(admin)") return null;

          const href = "/" + segments.slice(0, index + 2).join("/");
          const isLast = index === segments.slice(1).length - 1;
          const label = ROUTE_LABELS[segment] || segment;

          return (
            <li key={segment} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              {isLast ? (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link href={href} className="hover:text-foreground">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
