"use client";

import { useState } from "react";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";
import {
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder,
} from "lucide-react";
import { cn } from "@/styles/lib/utils";
import type { ICategory } from "@/types";

interface CategoriesTreeProps {
  categories?: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: (id: string) => void;
}

export function CategoriesTree({
  categories = [],
  onEdit,
  onDelete,
}: CategoriesTreeProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Категории не найдены
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function CategoryNode({
  category,
  onEdit,
  onDelete,
}: {
  category: ICategory;
  onEdit: (category: ICategory) => void;
  onDelete: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors",
          category.parentId && "ml-6",
        )}
      >
        {/* Expand button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 shrink-0"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!hasChildren}
          aria-label={isExpanded ? "Свернуть" : "Развернуть"}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            )
          ) : (
            <div className="h-3 w-3" aria-hidden="true" />
          )}
        </Button>

        {/* Folder icon */}
        {hasChildren ? (
          <FolderOpen
            className="h-4 w-4 text-muted-foreground shrink-0"
            aria-hidden="true"
          />
        ) : (
          <Folder
            className="h-4 w-4 text-muted-foreground shrink-0"
            aria-hidden="true"
          />
        )}

        {/* Name & slug */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{category.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            /{category.slug}
          </p>
        </div>

        {/* Product count */}
        <Badge variant="secondary" className="shrink-0">
          {category.productCount} товаров
        </Badge>

        {/* Actions */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(category)}
          aria-label={`Редактировать категорию ${category.name}`}
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(category.id)}
          aria-label={`Удалить категорию ${category.name}`}
          className="text-destructive hover:text-destructive"
          disabled={
            (category.productCount ?? 0) > 0 ||
            (category.children?.length ?? 0) > 0
          }
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-2 mt-2">
          {category.children?.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
