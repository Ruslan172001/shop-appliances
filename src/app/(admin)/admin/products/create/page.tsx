import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { ProductForm } from "@/styles/components/features/admin/products/product-form";

export default async function CreateProductPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      <div>
        <h2 className="text-2xl font-bold">Создание товара</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Заполните информацию о новом товаре
        </p>
      </div>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
