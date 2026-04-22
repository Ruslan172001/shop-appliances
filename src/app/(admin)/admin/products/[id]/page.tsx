import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { ProductForm } from "@/styles/components/features/admin/products/product-form";

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function EditProductPage({ params }: PageProps) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: String(product.price.toNumber()),
    oldPrice: product.oldPrice ? String(product.oldPrice.toNumber()) : "",
    categoryId: product.categoryId,
    quantity: String(product.quantity),
    model: product.model || "",
    color: product.color || "",
    country: product.country || "",
    specifications: (product.specifications as Record<string, string>) || {},
    images: product.images.map((img) => img.url),
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      <div>
        <h2 className="text-2xl font-bold">Редактирование товара</h2>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm
        mode="edit"
        initialData={initialData}
        categories={categories}
      />
    </div>
  );
}
