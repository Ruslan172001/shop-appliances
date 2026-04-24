"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  FolderTree,
  User,
  Settings,
  ArrowLeft,
  Percent,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/reviews", label: "Отзывы", icon: MessageSquare },
  { href: "/admin/promo-codes", label: "Промокоды", icon: Percent },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
  { href: "/admin/users", label: "Пользователи", icon: User },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSiderbar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r">
      <div className="flex items-center gap-2 p-4 border-b">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold">На главную</span>
        </Link>
      </div>
      <div className="px-4 py-6">
        <h2 className="text-lg font-bold text-sidebar-foreground">
          Админ-панель
        </h2>
      </div>
      <nav className="flex-1 px-2 space-y-1" aria-label="Главная навигация">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex item-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
