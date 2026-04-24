"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/styles/components/ui/button";
import { Upload, X } from "lucide-react";

interface ProductImageUploadProps {
  images: File[];
  previews: string[];
  onImagesChange: (images: File[]) => void;
  onPreviewsChange: (previews: string[]) => void;
  maxImages?: number;
}

export function ProductImageUpload({
  images,
  previews,
  onImagesChange,
  onPreviewsChange,
  maxImages = 5,
}: ProductImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const validFiles = Array.from(files)
        .filter(
          (file) =>
            file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024,
        )
        .slice(0, maxImages - images.length);

      if (validFiles.length === 0) return;

      const newImages = [...images, ...validFiles];
      const newPreviews = [...previews];

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newImages.length) {
            onPreviewsChange(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });

      onImagesChange(newImages);
    },
    [images, previews, maxImages, onImagesChange, onPreviewsChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onImagesChange(newImages);
    onPreviewsChange(newPreviews);
  };

  return (
    <div className="space-y-4">
      {images.length < maxImages && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload
            className="h-8 w-8 mx-auto mb-2 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground mb-1">
            Перетащите изображения сюда или
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.multiple = true;
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files) handleFiles(target.files);
              };
              input.click();
            }}
          >
            Выбрать файлы
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG до 5MB. Максимум {maxImages} изображений
          </p>
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-lg overflow-hidden border"
            >
              <Image
                src={preview}
                alt={`Изображение ${idx + 1}`}
                fill
                className="object-cover"
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
  );
}
