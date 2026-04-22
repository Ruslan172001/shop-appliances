import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ALLOWED_ROLES = new Set(["USER", "ADMIN"]);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const role = String(body?.role || "");

    if (!ALLOWED_ROLES.has(role)) {
      return NextResponse.json("Invalid role", { status: 400 });
    }

    if (session.user.id === id && role !== "ADMIN") {
      return NextResponse.json("Cannot change own role", { status: 400 });
    }
    const updated = await prisma.user.update({
      where: { id },
      data: { role: role as "USER" | "ADMIN" },
      select: {
        id: true,
        role: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[ADMIN_USERS_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
