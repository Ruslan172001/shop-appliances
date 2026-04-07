import Link from "next/link";
import { ChevronRight } from "lucide-react";
interface CategoryMiniCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    _count?: {
      products: number;
    };
  };
}
export default function CategoryMiniCard({ category }: CategoryMiniCardProps) {
  return (
    <Link
      href={`/catalog?category=${category.id}`}
      className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors group"
    >
      <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
        <span className="text-lg">📁</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
          {category.name}
        </h4>
        {category.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {category.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {category._count && (
          <span className="text-xs text-muted-foreground">
            {category._count.products} тов.
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}
