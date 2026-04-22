import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

function serializePromo(p: {
  id: string;
  code: string;
  type: string;
  value: Prisma.Decimal;
  minOrderAmount: Prisma.Decimal;
  maxDiscountAmount: Prisma.Decimal | null;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  description: string | null;
}) {
  return {
    id: p.id,
    code: p.code,
    type: p.type,
    value: Number(p.value),
    minOrderAmount: Number(p.minOrderAmount),
    maxDiscountAmount:
      p.maxDiscountAmount != null ? Number(p.maxDiscountAmount) : null,
    validFrom: p.validFrom.toISOString(),
    validUntil: p.validUntil.toISOString(),
    usageLimit: p.usageLimit,
    usageCount: p.usageCount,
    isActive: p.isActive,
    description: p.description,
  };
}

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const promo = await prisma.promoCode.findUnique({ where: { id } });
    if (!promo) {
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.json(serializePromo(promo));
  } catch (error) {
    console.error("[ADMIN_PROMO_CODE_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const current = await prisma.promoCode.findUnique({ where: { id } });
    if (!current) {
      return new NextResponse("Not found", { status: 404 });
    }

    const code = normalizeCode(String(body.code ?? ""));
    const type = String(body.type ?? "").toUpperCase();
    const value = Number(body.value);
    const minOrderAmount = Number(body.minOrderAmount ?? 0);
    const maxDiscountAmount =
      body.maxDiscountAmount === "" ||
      body.maxDiscountAmount === null ||
      body.maxDiscountAmount === undefined
        ? null
        : Number(body.maxDiscountAmount);
    const validFrom = body.validFrom ? new Date(body.validFrom) : null;
    const validUntil = body.validUntil ? new Date(body.validUntil) : null;
    const usageLimit = Math.max(0, parseInt(String(body.usageLimit ?? 0), 10));
    const isActive = Boolean(body.isActive);
    const description =
      typeof body.description === "string" ? body.description.trim() || null : null;

    if (!code || code.length < 2) {
      return new NextResponse("Укажите код минимум 2 символа", { status: 400 });
    }
    if (type !== "PERCENT" && type !== "FIXED") {
      return new NextResponse("Неверный тип скидки", { status: 400 });
    }
    if (!Number.isFinite(value) || value <= 0) {
      return new NextResponse("Некорректное значение скидки", { status: 400 });
    }
    if (type === "PERCENT" && value > 100) {
      return new NextResponse("Процент не может быть больше 100", { status: 400 });
    }
    if (!Number.isFinite(minOrderAmount) || minOrderAmount < 0) {
      return new NextResponse("Некорректная минимальная сумма заказа", {
        status: 400,
      });
    }
    if (
      maxDiscountAmount !== null &&
      (!Number.isFinite(maxDiscountAmount) || maxDiscountAmount < 0)
    ) {
      return new NextResponse("Некорректный максимум скидки", { status: 400 });
    }
    if (!validFrom || Number.isNaN(validFrom.getTime())) {
      return new NextResponse("Некорректная дата начала", { status: 400 });
    }
    if (!validUntil || Number.isNaN(validUntil.getTime())) {
      return new NextResponse("Некорректная дата окончания", { status: 400 });
    }
    if (validUntil <= validFrom) {
      return new NextResponse("Дата окончания должна быть позже начала", {
        status: 400,
      });
    }

    if (code !== current.code) {
      const taken = await prisma.promoCode.findUnique({ where: { code } });
      if (taken) {
        return new NextResponse("Промокод с таким кодом уже существует", {
          status: 409,
        });
      }
    }

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        code,
        type,
        value,
        minOrderAmount,
        maxDiscountAmount,
        validFrom,
        validUntil,
        usageLimit,
        isActive,
        description,
      },
    });

    return NextResponse.json(serializePromo(updated));
  } catch (error) {
    console.error("[ADMIN_PROMO_CODE_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.promoCode.findUnique({ where: { id } });
    if (!existing) {
      return new NextResponse("Not found", { status: 404 });
    }

    await prisma.promoCode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_PROMO_CODE_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
