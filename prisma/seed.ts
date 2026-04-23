import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/app/generated/prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("🌱 Сид: очистка БД + сохранение/создание админа...");

  // 1️⃣ Очистка в правильном порядке (из-за внешних ключей)
  await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany();
    await tx.order.deleteMany();
    await tx.review.deleteMany();
    await tx.wishlist.deleteMany();
    await tx.productImage.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();
    await tx.session.deleteMany();
    await tx.account.deleteMany();

    // Удаляем всех пользователей, КРОМЕ админа
    await tx.user.deleteMany({
      where: { email: { not: "admin@shop.com" } },
    });
  });

  // 2️⃣ Безопасное создание или обновление админа (upsert предотвращает дубликаты)
  const adminPassword = await hashPassword("admin123");
  await prisma.user.upsert({
    where: { email: "admin@shop.com" },
    update: {
      password: adminPassword,
      role: Role.ADMIN,
      name: "Администратор",
    },
    create: {
      email: "admin@shop.com",
      password: adminPassword,
      role: Role.ADMIN,
      name: "Администратор",
    },
  });

  console.log("✅ Готово. База очищена, админ сохранён/создан.");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
