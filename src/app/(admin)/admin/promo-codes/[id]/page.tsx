import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import {
  PromoCodeForm,
  toDatetimeLocalValue,
  type PromoCodeFormInitial,
} from "@/styles/components/features/admin/promo-codes/promo-code-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPromoCodePage({ params }: PageProps) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;
  const promo = await prisma.promoCode.findUnique({ where: { id } });

  if (!promo) {
    notFound();
  }

  const initial: PromoCodeFormInitial = {
    code: promo.code,
    type: promo.type === "FIXED" ? "FIXED" : "PERCENT",
    value: promo.value.toString(),
    minOrderAmount: promo.minOrderAmount.toString(),
    maxDiscountAmount: promo.maxDiscountAmount?.toString() ?? "",
    validFrom: toDatetimeLocalValue(promo.validFrom.toISOString()),
    validUntil: toDatetimeLocalValue(promo.validUntil.toISOString()),
    usageLimit: String(promo.usageLimit),
    usageCount: promo.usageCount,
    isActive: promo.isActive,
    description: promo.description ?? "",
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      <div>
        <h2 className="text-2xl font-bold">Редактирование промокода</h2>
        <p className="text-sm text-muted-foreground font-mono">{promo.code}</p>
      </div>
      <PromoCodeForm mode="edit" initial={initial} promoId={promo.id} />
    </div>
  );
}
