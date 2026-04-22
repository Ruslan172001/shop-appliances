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

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)),
    );
    const search = (searchParams.get("search") || "").trim();
    const active = searchParams.get("active") || "all";

    const where: Prisma.PromoCodeWhereInput = {};
    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (active === "true") {
      where.isActive = true;
    } else if (active === "false") {
      where.isActive = false;
    }

    const [rows, total] = await Promise.all([
      prisma.promoCode.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ validUntil: "desc" }, { code: "asc" }],
      }),
      prisma.promoCode.count({ where }),
    ]);

    return NextResponse.json({
      promoCodes: rows.map(serializePromo),
      total,
      pageCount: Math.ceil(total / pageSize) || 0,
    });
  } catch (error) {
    console.error("[ADMIN_PROMO_CODES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
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

    const existing = await prisma.promoCode.findUnique({ where: { code } });
    if (existing) {
      return new NextResponse("Промокод с таким кодом уже существует", {
        status: 409,
      });
    }

    const created = await prisma.promoCode.create({
      data: {
        code,
        type,
        value,
        minOrderAmount,
        maxDiscountAmount,
        validFrom,
        validUntil,
        usageLimit,
        usageCount: 0,
        isActive,
        description,
      },
    });

    return NextResponse.json(serializePromo(created));
  } catch (error) {
    console.error("[ADMIN_PROMO_CODES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
