"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export interface ProfileFormState {
  error?: string;
  success?: boolean;
}

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходима авторизация" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name?.trim()) {
    return { error: "Введите имя" };
  }

  if (!email?.trim() || !email.includes("@")) {
    return { error: "Введите корректный email" };
  }

  // Проверяем уникальность email
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      id: { not: session.user.id },
    },
  });

  if (existingUser) {
    return { error: "Этот email уже используется другим пользователем" };
  }

  // Если меняется пароль — проверяем текущий и новый
  if (newPassword || currentPassword) {
    if (!currentPassword) {
      return { error: "Введите текущий пароль для смены пароля" };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Новые пароли не совпадают" };
    }

    if (newPassword.length < 6) {
      return { error: "Пароль должен быть не менее 6 символов" };
    }

    // Проверяем текущий пароль
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return { error: "Ошибка: пароль не установлен" };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { error: "Текущий пароль неверный" };
    }
  }

  // Обновляем профиль
  const updateData: { name: string; email: string; password?: string } = {
    name: name.trim(),
    email,
  };

  if (newPassword) {
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  revalidatePath("/profile");

  return { success: true };
}
