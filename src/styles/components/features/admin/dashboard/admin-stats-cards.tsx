import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import {
  Package,
  Star,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/styles/lib/utils";

interface StatCardData {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  icon: typeof Package;
  href?: string;
  color: string;
}

interface AdminStatsCardsProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalReviews: number;
    revenue: number;
    revenueChange?: number;
  };
}
const STAT_CARDS: (stats: AdminStatsCardsProps["stats"]) => StatCardData[] = (
  stats,
) => [
  {
    title: "Всего товаров",
    value: stats.totalProducts.toLocaleString("ru-RU"),
    icon: Package,
    href: "/admin/products",
    color: "text-blue-500",
  },
  {
    title: "Всего заказов",
    value: stats.totalOrders.toLocaleString("ru-RU"),
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "text-orange-500",
  },
  {
    title: "Всего отзывов",
    value: stats.totalReviews.toLocaleString("ru-RU"),
    icon: Star,
    href: "/admin/reviews",
    color: "text-yellow-500",
  },
  {
    title: "Общая выручка",
    value: `${stats.revenue.toLocaleString("ru-RU")} ₽`,
    change: stats.revenueChange
      ? {
          value: Math.abs(stats.revenueChange),
          trend: stats.revenueChange > 0 ? "up" : "down",
        }
      : undefined,
    icon: DollarSign,
    href: "/admin/reviews",
    color: "text-green-500",
  },
];

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = STAT_CARDS(stats);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const CardWrapper = card.href ? Link : "div";
        return (
          <Card
            key={card.title}
            className={cn(
              "transition-shadow hover:shadow-md",
              card.href && "cursor-pointer hover:bg-accent/50",
            )}
          >
            <CardWrapper
              href={card.href || ""}
              className="block"
              aria-label={`${card.title}:${card.value}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon
                  className={cn("h-4 w-4", card.color)}
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.change && (
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    {card.change.trend === "up" ? (
                      <TrendingUp
                        className={cn("h-4 w-4 text-green-500")}
                        aria-hidden="true"
                      />
                    ) : (
                      <TrendingDown
                        className={cn("h-4 w-4 text-red-500")}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn(
                        card.change.trend === "up"
                          ? "text-green-500"
                          : "text-red-500",
                      )}
                    >
                      {card.change.value}%
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      к прошлому месяцу
                    </span>
                  </div>
                )}
              </CardContent>
            </CardWrapper>
          </Card>
        );
      })}
    </div>
  );
}
