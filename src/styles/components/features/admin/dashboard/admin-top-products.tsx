import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import Link from "next/link";

export interface TopProduct {
  id: string;
  name: string;
  slug: string;
  sales: number;
  revenue: number;
}
interface AdminTopProductsProps {
  products: TopProduct[];
}
export function AdminTopProducts({ products }: AdminTopProductsProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Топ товаров</CardTitle>
          <CardDescription>Товаров пока нет</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ товаров</CardTitle>
        <CardDescription>Самые продаваемые товары</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, idx) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="flex items-center justify-between p-3 border-rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-bold shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.sales} продаж
                  </p>
                </div>
              </div>
              <div className="text-right ml-4 shrink-0">
                <p className="font-semibold">
                  {product.revenue.toLocaleString("ru-RU")} ₽
                </p>
                <p className="text-xs text-muted-foreground">Выручка</p>
              </div>
            </Link>
          ))}
          <Link
            href="/admin/products"
            className="block text-center text-sm text-primary hover:undeline mt-4"
          >
            Все товары →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
