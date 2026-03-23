"use server";

import { signIn, signOut } from "lib/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "lib/prisma";
import { loginSchema, registerSchema, FormState } from "lib/definitions";

export async function login(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: error.cause?.err?.message || "Ошибка при входе",
      };
    }
    throw error;
  }
}

export async function register(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  // Проверяем, существует ли уже пользователь
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      errors: {
        email: ["Пользователь с таким email уже существует"],
      },
    };
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создаем пользователя
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Автоматически входим после регистрации
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message:
          "Аккаунт создан, но вход не выполнен. Попробуйте войти вручную.",
      };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
