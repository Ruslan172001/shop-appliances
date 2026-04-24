"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

import type { IProductImage } from "@/types";
interface ProductGalleryProps {
  images: IProductImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Нет изображений</span>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt || "Товар"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw,50vw priority"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border-2 transition-colors",
                selectedImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300",
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `Изображение ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
