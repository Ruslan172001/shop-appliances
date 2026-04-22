import { notFound } from "next/navigation";
import prisma from "lib/prisma";
import ProductGallery from "@/styles/components/features/product/product-gallery";
import ProductInfo from "@/styles/components/features/product/product-info";
import ProductReviews from "@/styles/components/features/product/product-reviews";
import ProductSpecs from "@/styles/components/features/product/product-specs";
import { Separator } from "@/styles/components/ui/separator";
import { ICategory, IProduct, IProductImage } from "types";
import { isRecord } from "lib/type-guard";

interface PageProps {
  params: Promise<{ slug: string }>;
}
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
      },
      reviews: {
        include: {
          user: {
            select: { name: true, id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product) return notFound();
  const images: IProductImage[] = product.images.map((img) => ({
    ...img,
    alt: img.alt ?? undefined,
  }));

  // ✅ Преобразуем category
  const category: ICategory = {
    ...product.category,
    description: product.category.description ?? undefined,
    productCount: 0,
  };

  // ✅ Преобразуем specifications
  const specifications:
    | Record<string, string | number | boolean | null>
    | undefined = isRecord(product.specifications)
    ? (product.specifications as Record<
        string,
        string | number | boolean | null
      >)
    : undefined;

  // ✅ Собираем productData
  const productData: IProduct = {
    ...product,
    price: product.price.toNumber(),
    oldPrice: product.oldPrice?.toNumber(),
    inStock: product.quantity > 0,
    images,
    category,
    specifications,
  };
  const averageRating = product.reviewCount > 0 ? product.rating : 0;

  return (
    <div className="container mx-auto py-8">
      <nav className="text-sm text-muted-foreground mb-6">
        <a href="/catalog" className="hover:underline">
          Каталог
        </a>
        {" / "}
        <a
          href={`/catalog?category=${product.categoryId}`}
          className="hover:underline"
        >
          {product.category.name}
        </a>
        {" / "}
        <span>{product.name}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductGallery images={product.images} />
        <ProductInfo product={productData} />
      </div>
      <Separator className="my-8" />
      <ProductSpecs specifications={specifications} />
      <Separator className="my-8" />
      <ProductReviews
        productId={product.id}
        reviews={product.reviews}
        averageRating={averageRating}
        totalReviews={product.reviewCount}
      />
    </div>
  );
}
