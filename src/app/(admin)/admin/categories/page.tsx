"use client";
import { CategoriesTree } from "@/styles/components/features/admin/categories/categories-tree";
import { CategoryDialog } from "@/styles/components/features/admin/categories/category-dialog";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/styles/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import type { ICategory } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<ICategory | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setCategories(data.categories);
    } catch {
      toast.error("Не удалось загрузить категории");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
  }) => {
    try {
      const method = editCategory ? "PUT" : "POST";

      const url = editCategory
        ? `/api/admin/categories/${editCategory.id}`
        : `/api/admin/categories`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      toast.success(editCategory ? "Категория обновлена" : "Категория создана");
      setDialogOpen(false);
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ошибка при сохрании";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту категорию?")) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Ошибка при удалении");
        return;
      }
      toast.success("Категория удалена");
      fetchCategories();
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditCategory(category);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditCategory(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold"> Категории</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Управление деревом категорий
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Создать категорию
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-50">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      ) : (
        <CategoriesTree
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        editCategory={editCategory}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
