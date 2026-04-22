import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { PromoCodeForm } from "@/styles/components/features/admin/promo-codes/promo-code-form";

export default async function CreatePromoCodePage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      <div>
        <h2 className="text-2xl font-bold">Новый промокод</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Процент или фиксированная скидка, срок действия и лимит использований
        </p>
      </div>
      <PromoCodeForm mode="create" />
    </div>
  );
}
