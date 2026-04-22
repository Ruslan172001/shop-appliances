"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/styles/components/ui/dialog";
import { Button } from "@/styles/components/ui/button";
import { Input } from "@/styles/components/ui/input";
import { Label } from "@/styles/components/ui/label";
import { Textarea } from "@/styles/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/styles/components/ui/select";
import { Loader2 } from "lucide-react";
import { toSlug } from "@/lib/slug-utils";
import type { ICategory } from "@/types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: ICategory[];
  editCategory: ICategory | null;
  onSubmit: (data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
  }) => Promise<void>;
}

export function CategoryDialog({
  open,
  onOpenChange,
  categories = [],
  editCategory,
  onSubmit,
}: CategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("none");

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setSlug(editCategory.slug);
      setDescription(editCategory.description || "");
      setParentId(editCategory.parentId || "none");
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setParentId("none");
    }
  }, [editCategory, open]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editCategory) {
      setSlug(toSlug(value));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        slug,
        description: description || undefined,
        parentId: parentId === "none" ? undefined : parentId,
      });
    } finally {
      setLoading(false);
    }
  };
  const parentOptions = categories.filter(
    (category) => category.id !== editCategory?.id,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editCategory ? "Редактировать категорию" : "Создать категорию"}
          </DialogTitle>
          <DialogDescription>
            {editCategory
              ? "Измените информацию о категории"
              : "Заполните инфонормацию о новой категории"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name"> Название*</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="category-slug">Slug*</Label>
            <Input
              id="category-slug"
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
              required
              aria-required="true"
              placeholder="bytovaya-tehnika"
            />
          </div>
          <div>
            <Label htmlFor="category-parent">Родительская категория</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger
                id="category-parent"
                aria-label="Выбрать родительскую категорию"
              >
                <SelectValue placeholder="Нет родительской категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без родителя(корневая)</SelectItem>
                {parentOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category-description">Описание</Label>
            <Textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editCategory ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
