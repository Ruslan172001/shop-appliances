"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ReviewFormState {
  error?: string;
  success?: boolean;
}

function getString(formData: FormData, key: string): string {
  const val = formData.get(key);
  return typeof val === "string" ? val : "";
}

export async function submitReview(
  prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходима авторизация" };
  }

  const productId = getString(formData, "productId");
  const rawRating = getString(formData, "rating");
  const rating = Number(rawRating);
  const comment = getString(formData, "comment");

  if (!productId) {
    return { error: "Товар не указан" };
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Рейтинг должен быть от 1 до 5" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    return { error: "Товар не найден" };
  }

  const existing = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });
  if (existing) {
    return { error: "Вы уже оставили отзыв" };
  }

  // Транзакция: создаём отзыв + пересчитываем рейтинг атомарно
  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        comment: comment?.trim() || undefined,
      },
    });

    const reviews = await tx.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await tx.product.update({
      where: { id: productId },
      data: { rating: avgRating, reviewCount: reviews.length },
    });
  });

  revalidatePath(`/product/${product.slug}`);
  return { success: true };
}

export async function deleteReview(
  reviewId: string,
  productId: string,
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходима авторизация" };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true, productId: true },
  });
  if (!review) {
    return { error: "Отзыв не найден" };
  }

  if (review.userId !== session.user.id) {
    return { error: "Вы не можете удалить чужой отзыв" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });

  // Транзакция: удаляем отзыв + пересчитываем рейтинг атомарно
  await prisma.$transaction(async (tx) => {
    await tx.review.delete({
      where: { id: reviewId },
    });

    const reviews = await tx.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await tx.product.update({
      where: { id: productId },
      data: { rating: avgRating, reviewCount: reviews.length },
    });
  });

  if (product) {
    revalidatePath(`/product/${product.slug}`);
  }

  return { success: true };
}
