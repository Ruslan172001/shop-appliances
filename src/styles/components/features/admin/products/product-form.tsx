"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/styles/components/ui/button";
import { Input } from "@/styles/components/ui/input";
import { Textarea } from "@/styles/components/ui/textarea";
import { Label } from "@/styles/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/components/ui/select";
import { Separator } from "@/styles/components/ui/separator";
import { ProductImageUpload } from "./product-image-upload";
import { SpecificationsEditor } from "./specifications-editor";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type { ICategory } from "@/types";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  oldPrice?: string;
  categoryId: string;
  quantity: string;
  model?: string;
  color?: string;
  country?: string;
  specifications: Record<string, string>;
}
interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: ProductFormData & { id: string; images?: string[] };
  categories: ICategory[];
}
export function ProductForm({
  mode,
  initialData,
  categories,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialData?.images || []);
  const [imageUrl, setImageUrl] = useState("");

  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      price: "",
      oldPrice: "",
      categoryId: "",
      quantity: "",
      model: "",
      color: "",
      country: "",
      specifications: {},
    },
  );

  const addImageFromUrl = () => {
    if (!imageUrl.trim()) return;
    if (previews.length >= 10) return;

    // Проверка формата
    const validFormats = [
      ".webp",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".avif",
      ".svg",
    ];
    const url = imageUrl.trim().toLowerCase();
    const isValid = validFormats.some((ext) => url.includes(ext));

    if (!isValid) {
      toast.error("Поддерживаемые форматы: webp, jpg, png, gif, avif, svg");
      return;
    }

    setPreviews([...previews, imageUrl.trim()]);
    setImageUrl("");
  };

  const removeImage = (index: number) => {
    setPreviews(previews.filter((_, i) => i !== index));
  };
  const updateField = (
    field: keyof ProductFormData,
    value: string | Record<string, string | number | boolean | null>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (
      field === "name" &&
      mode === "create" &&
      !initialData &&
      typeof value === "string"
    ) {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      // Для редактирования отправляем JSON
      if (mode === "edit") {
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, imageUrls: previews }),
        });
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error);
        }
      } else {
        // Для создания отправляем JSON с imageUrls
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, imageUrls: previews }),
        });
        if (!res.ok) throw new Error("Failed");
      }

      toast.success(mode === "create" ? "Товар создан" : "Товар обновлен");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при сохранении товара";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Основная информация */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Основная информация</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="product-name">Название *</Label>
            <Input
              id="product-name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="product-slug">Slug *</Label>
            <Input
              id="product-slug"
              value={formData.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              required
              aria-required="true"
              placeholder="avtomatika"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="product-description">Описание</Label>
          <Textarea
            id="product-description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <Separator />

      {/* Цены */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Цены и наличие</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="product-price">Цена *</Label>
            <Input
              id="product-price"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => updateField("price", e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="product-old-price">Старая цена</Label>
            <Input
              id="product-old-price"
              type="number"
              min="0"
              value={formData.oldPrice || ""}
              onChange={(e) => updateField("oldPrice", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="product-quantity">Количество *</Label>
            <Input
              id="product-quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => updateField("quantity", e.target.value)}
              required
              aria-required="true"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Категория и характеристики */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Категория и характеристики</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="product-category">Категория *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(val) => updateField("categoryId", val)}
            >
              <SelectTrigger
                id="product-category"
                aria-label="Выбрать категорию"
              >
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="product-model">Модель</Label>
            <Input
              id="product-model"
              value={formData.model || ""}
              onChange={(e) => updateField("model", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="product-color">Цвет</Label>
            <Input
              id="product-color"
              value={formData.color || ""}
              onChange={(e) => updateField("color", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="product-country">Страна</Label>
            <Input
              id="product-country"
              value={formData.country || ""}
              onChange={(e) => updateField("country", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Характеристики */}
      <div className="space-y-4">
        <SpecificationsEditor
          specifications={formData.specifications}
          onChange={(specs) => updateField("specifications", specs)}
        />
      </div>

      <Separator />

      {/* Изображения */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Изображения ({previews.length}/10)
        </h3>

        {/* Ввод URL */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="image-url">Ссылка на изображение</Label>
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.webp"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addImageFromUrl())
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              Форматы: webp, jpg, png, gif, avif, svg
            </p>
          </div>
          <div className="flex items-center">
            <Button
              type="button"
              onClick={addImageFromUrl}
              disabled={!imageUrl.trim() || previews.length >= 10}
            >
              Добавить
            </Button>
          </div>
        </div>

        {/* Или загрузка файлов */}
        <div className="text-center text-sm text-muted-foreground">или</div>
        <ProductImageUpload
          images={images}
          previews={previews.filter((_, i) => i < images.length)}
          onImagesChange={setImages}
          onPreviewsChange={(newPreviews) => {
            const urlPreviews = previews.slice(images.length);
            setPreviews([...urlPreviews, ...newPreviews]);
          }}
          maxImages={10 - previews.length}
        />

        {/* Превью всех изображений */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {previews.map((preview, idx) => (
              <div
                key={idx}
                className="relative group aspect-square rounded-lg overflow-hidden border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={`Изображение ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(idx)}
                    aria-label={`Удалить изображение ${idx + 1}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                {idx === 0 && (
                  <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                    Главное
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Кнопки */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {mode === "create" ? "Создать товар" : "Сохранить изменения"}
        </Button>
      </div>
    </form>
  );
}
