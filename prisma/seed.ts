import { PrismaPg } from "@prisma/adapter-pg";
import {
  OrderStatus,
  PrismaClient,
  Role,
} from "../src/app/generated/prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Инициализация подключения через адаптер
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// ---------------- ХЕЛПЕРЫ ----------------

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// ---------------- ДАННЫЕ ----------------

const categoriesData = [
  {
    name: "Бытовая техника",
    slug: "home-appliances",
    children: [
      { name: "Холодильники", slug: "refrigerators" },
      { name: "Стиральные машины", slug: "washing-machines" },
      { name: "Посудомоечные машины", slug: "dishwashers" },
      { name: "Плиты и духовки", slug: "ovens" },
    ],
  },
  {
    name: "Электроника",
    slug: "electronics",
    children: [
      { name: "Телевизоры", slug: "tvs" },
      { name: "Ноутбуки", slug: "laptops" },
      { name: "Смартфоны", slug: "smartphones" },
      { name: "Планшеты", slug: "tablets" },
    ],
  },
  {
    name: "Климатическая техника",
    slug: "climate",
    children: [
      { name: "Кондиционеры", slug: "air-conditioners" },
      { name: "Обогреватели", slug: "heaters" },
      { name: "Очистители воздуха", slug: "air-purifiers" },
    ],
  },
];

const productsData = [
  {
    name: "Samsung RB-3700",
    slug: "samsung-rb-3700",
    description:
      "Надежный двухкамерный холодильник с технологией No Frost. Идеально подходит для семьи из 3-4 человек. Тихий инверторный компрессор обеспечивает энергоэффективность и низкий уровень шума.",
    price: 45999,
    oldPrice: 52999,
    model: "RB-3700",
    color: "Серебристый",
    country: "Южная Корея",
    quantity: 15,
    rating: 4.7,
    reviewCount: 23,
    categorySlug: "refrigerators",
    specifications: {
      volume: "370 л",
      energyClass: "A+",
      dimensions: "185x60x65 см",
      weight: "65 кг",
      noiseLevel: "38 дБ",
      freezerVolume: "98 л",
      compressorType: "Инверторный",
    },
    images: [
      {
        url: "/products/samsung-rb-3700-1.jpg",
        alt: "Samsung RB-3700 спереди",
        isMain: true,
        order: 0,
      },
      {
        url: "/products/samsung-rb-3700-2.jpg",
        alt: "Samsung RB-3700 внутри",
        isMain: false,
        order: 1,
      },
      {
        url: "/products/samsung-rb-3700-3.jpg",
        alt: "Samsung RB-3700 сбоку",
        isMain: false,
        order: 2,
      },
    ],
  },
  {
    name: "LG F2J3HS2W",
    slug: "lg-f2j3hs2w",
    description:
      "Стиральная машина с прямой приводом и функцией пара. Бережная стирка деликатных тканей и удаление аллергенов. Управление со смартфона через Wi-Fi.",
    price: 34999,
    oldPrice: 39999,
    model: "F2J3HS2W",
    color: "Белый",
    country: "Южная Корея",
    quantity: 8,
    rating: 4.5,
    reviewCount: 18,
    categorySlug: "washing-machines",
    specifications: {
      loadCapacity: "6 кг",
      spinSpeed: "1200 об/мин",
      energyClass: "A++",
      dimensions: "85x60x56 см",
      weight: "56 кг",
      noiseLevel: "54 дБ",
      programs: 16,
      steamFunction: true,
    },
    images: [
      {
        url: "/products/lg-f2j3hs2w-1.jpg",
        alt: "LG F2J3HS2W спереди",
        isMain: true,
        order: 0,
      },
      {
        url: "/products/lg-f2j3hs2w-2.jpg",
        alt: "LG F2J3HS2W панель управления",
        isMain: false,
        order: 1,
      },
    ],
  },
  {
    name: "Sony KD-55X80J",
    slug: "sony-kd-55x80j",
    description:
      "4K HDR телевизор с диагональю 55 дюймов. Процессор 4K X1 обеспечивает четкое изображение. Поддержка Dolby Vision и Atmos для кинематографического эффекта.",
    price: 69999,
    oldPrice: 79999,
    model: "KD-55X80J",
    color: "Черный",
    country: "Япония",
    quantity: 5,
    rating: 4.8,
    reviewCount: 31,
    categorySlug: "tvs",
    specifications: {
      diagonal: "55 дюймов",
      resolution: "3840x2160 (4K)",
      hdr: "Dolby Vision, HDR10",
      smartTV: "Android TV",
      dimensions: "123x71x33 см",
      weight: "14.5 кг",
      refreshRate: "60 Гц",
      hdmiPorts: 4,
    },
    images: [
      {
        url: "/products/sony-kd-55x80j-1.jpg",
        alt: "Sony KD-55X80J фронт",
        isMain: true,
        order: 0,
      },
      {
        url: "/products/sony-kd-55x80j-2.jpg",
        alt: "Sony KD-55X80J боковой вид",
        isMain: false,
        order: 1,
      },
      {
        url: "/products/sony-kd-55x80j-3.jpg",
        alt: "Sony KD-55X80J пульт",
        isMain: false,
        order: 2,
      },
    ],
  },
  {
    name: "MacBook Air M2",
    slug: "macbook-air-m2",
    description:
      "Ультратонкий ноутбук на чипе Apple M2. До 18 часов работы без подзарядки. Жидкостно-кристаллический дисплей Retina с поддержкой 1 миллиарда цветов.",
    price: 119999,
    oldPrice: 129999,
    model: "MGN63",
    color: "Space Gray",
    country: "США",
    quantity: 12,
    rating: 4.9,
    reviewCount: 45,
    categorySlug: "laptops",
    specifications: {
      processor: "Apple M2",
      ram: "8 ГБ",
      storage: "256 ГБ SSD",
      display: '13.6" Retina',
      resolution: "2560x1664",
      weight: "1.24 кг",
      batteryLife: "18 часов",
      ports: "2x Thunderbolt, MagSafe",
    },
    images: [
      {
        url: "/products/macbook-air-m2-1.jpg",
        alt: "MacBook Air M2 открытый",
        isMain: true,
        order: 0,
      },
      {
        url: "/products/macbook-air-m2-2.jpg",
        alt: "MacBook Air M2 закрытый",
        isMain: false,
        order: 1,
      },
    ],
  },
  {
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description:
      "Флагманский смартфон с титановым корпусом. Чип A17 Pro, профессиональная камера 48 Мп, кнопка Action Button. Первый iPhone с портом USB-C.",
    price: 109999,
    oldPrice: 119999,
    model: "A3108",
    color: "Natural Titanium",
    country: "США",
    quantity: 20,
    rating: 4.8,
    reviewCount: 67,
    categorySlug: "smartphones",
    specifications: {
      display: '6.1" Super Retina XDR',
      processor: "A17 Pro",
      storage: "128 ГБ",
      camera: "48 Мп + 12 Мп + 12 Мп",
      battery: "3274 мАч",
      weight: "187 г",
      waterResistance: "IP68",
      connectivity: "5G, Wi-Fi 6E",
    },
    images: [
      {
        url: "/products/iphone-15-pro-1.jpg",
        alt: "iPhone 15 Pro спереди",
        isMain: true,
        order: 0,
      },
      {
        url: "/products/iphone-15-pro-2.jpg",
        alt: "iPhone 15 Pro сзади",
        isMain: false,
        order: 1,
      },
      {
        url: "/products/iphone-15-pro-3.jpg",
        alt: "iPhone 15 Pro камера",
        isMain: false,
        order: 2,
      },
    ],
  },
  {
    name: "Bosch SMV4HTX31E",
    slug: "bosch-smv4htx31e",
    description:
      "Встраиваемая посудомоечная машина с технологией Zeolith. Экономия воды до 10 литров за цикл. Тихая работа и эффективная сушка.",
    price: 54999,
    oldPrice: 64999,
    model: "SMV4HTX31E",
    color: "Нержавеющая сталь",
    country: "Германия",
    quantity: 6,
    rating: 4.6,
    reviewCount: 14,
    categorySlug: "dishwashers",
    specifications: {
      capacity: "14 комплектов",
      energyClass: "A++",
      waterConsumption: "9.5 л",
      dimensions: "81.5x59.8x55 см",
      weight: "48 кг",
      noiseLevel: "44 дБ",
      programs: 6,
      dryingSystem: "Zeolith",
    },
    images: [
      {
        url: "/products/bosch-smv4htx31e-1.jpg",
        alt: "Bosch SMV4HTX31E",
        isMain: true,
        order: 0,
      },
      {
        url: "/products/bosch-smv4htx31e-2.jpg",
        alt: "Bosch SMV4HTX31E внутри",
        isMain: false,
        order: 1,
      },
    ],
  },
  {
    name: "Electrolux EWH-10",
    slug: "electrolux-ewh-10",
    description:
      "Накопительный водонагреватель объемом 100 литров. Защита от перегрева и коррозии. Экономичный режим ECO для снижения потребления энергии.",
    price: 12999,
    oldPrice: 15999,
    model: "EWH-100",
    color: "Белый",
    country: "Швеция",
    quantity: 10,
    rating: 4.3,
    reviewCount: 9,
    categorySlug: "heaters",
    specifications: {
      volume: "100 л",
      power: "2 кВт",
      heatingTime: "180 мин",
      dimensions: "120x45x45 см",
      weight: "28 кг",
      maxTemperature: "75°C",
      protection: "IPX4",
    },
    images: [
      {
        url: "/products/electrolux-ewh-10-1.jpg",
        alt: "Electrolux EWH-10",
        isMain: true,
        order: 0,
      },
    ],
  },
  {
    name: "Xiaomi Mi Air Purifier 4",
    slug: "xiaomi-mi-air-purifier-4",
    description:
      "Очиститель воздуха с HEPA-фильтром. Охват до 48 м². Управление через приложение Mi Home. Отображение качества воздуха в реальном времени.",
    price: 14999,
    oldPrice: 17999,
    model: "AC-M15-SC",
    color: "Белый",
    country: "Китай",
    quantity: 25,
    rating: 4.7,
    reviewCount: 52,
    categorySlug: "air-purifiers",
    specifications: {
      coverage: "48 м²",
      cadr: "400 м³/ч",
      filterType: "HEPA H13",
      noiseLevel: "32 дБ",
      dimensions: "28x28x52 см",
      weight: "4.8 кг",
      powerConsumption: "38 Вт",
      smartControl: true,
    },
    images: [
      {
        url: "/products/xiaomi-air-purifier-4-1.jpg",
        alt: "Xiaomi Air Purifier 4",
        isMain: true,
        order: 0,
      },
      {
        url: "/products/xiaomi-air-purifier-4-2.jpg",
        alt: "Xiaomi Air Purifier 4 дисплей",
        isMain: false,
        order: 1,
      },
    ],
  },
];

const reviewsData = [
  {
    productIdSlug: "samsung-rb-3700",
    rating: 5,
    comment: "Отличный холодильник! Тихий, вместительный, морозит отлично.",
    userEmail: "user@example.com",
  },
  {
    productIdSlug: "samsung-rb-3700",
    rating: 4,
    comment: "Хороший холодильник, но доставка задержалась на 2 дня.",
    userEmail: "maria@example.com",
  },
  {
    productIdSlug: "sony-kd-55x80j",
    rating: 5,
    comment: "Картинка просто потрясающая! Звук тоже на высоте.",
    userEmail: "user@example.com",
  },
  {
    productIdSlug: "macbook-air-m2",
    rating: 5,
    comment: "Лучший ноутбук для работы. Батарея держит весь день.",
    userEmail: "maria@example.com",
  },
  {
    productIdSlug: "iphone-15-pro",
    rating: 4,
    comment: "Крутой телефон, но цена кусается. Камера супер!",
    userEmail: "user@example.com",
  },
  {
    productIdSlug: "lg-f2j3hs2w",
    rating: 5,
    comment: "Стирает отлично, очень тихая. Рекомендую!",
    userEmail: "maria@example.com",
  },
  {
    productIdSlug: "xiaomi-mi-air-purifier-4",
    rating: 5,
    comment: "Воздух стал заметно чище. Аллергия прошла.",
    userEmail: "user@example.com",
  },
];

// ---------------- ОСНОВНАЯ ФУНКЦИЯ ----------------

async function main() {
  console.log("🌱 Начало сидирования базы данных...");

  // 1. Очистка базы (в правильном порядке из-за внешних ключей)
  console.log("🗑️  Очистка существующих данных...");
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Создание пользователей
  console.log("👤  Создание пользователей...");
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  const admin = await prisma.user.create({
    data: {
      name: "Администратор",
      email: "admin@shop.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Иван Петров",
      email: "user@example.com",
      password: userPassword,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Мария Сидорова",
      email: "maria@example.com",
      password: userPassword,
      role: Role.USER,
    },
  });

  console.log(`✅ Создан админ: ${admin.email}`);
  console.log(`✅ Создан пользователь: ${user.email}`);
  console.log(`✅ Создан пользователь: ${user2.email}`);

  // Словарь пользователей для отзывов
  const usersByEmail: Record<string, { id: string }> = {
    [admin.email]: admin,
    [user.email]: user,
    [user2.email]: user2,
  };

  // 3. Создание категорий
  console.log("📁  Создание категорий...");
  const createdCategories: Record<string, { id: string }> = {};

  for (const category of categoriesData) {
    const parent = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
      },
    });
    createdCategories[category.slug] = parent;

    for (const child of category.children) {
      const childCategory = await prisma.category.create({
        data: {
          name: child.name,
          slug: child.slug,
          parent: { connect: { id: parent.id } },
        },
      });
      createdCategories[child.slug] = childCategory;
    }
  }

  console.log(`✅ Создано ${Object.keys(createdCategories).length} категорий`);

  // 4. Создание товаров
  console.log("📦  Создание товаров...");
  const createdProducts: Record<string, { id: string }> = {};

  for (const productData of productsData) {
    const category = createdCategories[productData.categorySlug];
    if (!category) {
      console.error(`❌ Категория не найдена: ${productData.categorySlug}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        oldPrice: productData.oldPrice,
        model: productData.model,
        color: productData.color,
        country: productData.country,
        quantity: productData.quantity,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        specifications: productData.specifications,
        category: { connect: { id: category.id } },
      },
    });

    // Создание изображений
    for (const imageData of productData.images) {
      await prisma.productImage.create({
        data: {
          ...imageData,
          product: { connect: { id: product.id } },
        },
      });
    }

    createdProducts[productData.slug] = product;
  }

  console.log(`✅ Создано ${Object.keys(createdProducts).length} товаров`);

  // 5. Создание отзывов
  console.log("⭐  Создание отзывов...");
  for (const reviewData of reviewsData) {
    const product = createdProducts[reviewData.productIdSlug];
    if (!product) continue;

    const reviewUser = usersByEmail[reviewData.userEmail] || user;

    await prisma.review.create({
      data: {
        rating: reviewData.rating,
        comment: reviewData.comment,
        user: { connect: { id: reviewUser.id } },
        product: { connect: { id: product.id } },
      },
    });
  }

  console.log(`✅ Создано ${reviewsData.length} отзывов`);

  // 6. Создание заказов
  console.log("🛒  Создание заказов...");

  const order1 = await prisma.order.create({
    data: {
      total: 45999,
      status: OrderStatus.DELIVERED,
      user: { connect: { id: user.id } },
      address: "г. Москва, ул. Ленина, д. 10, кв. 5",
      phone: "+7 (999) 123-45-67",
      email: user.email,
      paidAt: new Date("2024-01-15"),
      items: {
        create: {
          product: { connect: { slug: "samsung-rb-3700" } },
          price: 45999,
          quantity: 1,
          name: "Samsung RB-3700",
          image: "/products/samsung-rb-3700-1.jpg",
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      total: 189998,
      status: OrderStatus.PROCESSING,
      user: { connect: { id: user.id } },
      address: "г. Москва, ул. Ленина, д. 10, кв. 5",
      phone: "+7 (999) 123-45-67",
      email: user.email,
      items: {
        create: [
          {
            product: { connect: { slug: "iphone-15-pro" } },
            price: 109999,
            quantity: 1,
            name: "iPhone 15 Pro",
            image: "/products/iphone-15-pro-1.jpg",
          },
          {
            product: { connect: { slug: "macbook-air-m2" } },
            price: 119999,
            quantity: 1,
            name: "MacBook Air M2",
            image: "/products/macbook-air-m2-1.jpg",
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      total: 14999,
      status: OrderStatus.PENDING,
      user: { connect: { id: user2.id } },
      address: "г. Санкт-Петербург, Невский пр., д. 50",
      phone: "+7 (999) 987-65-43",
      email: user2.email,
      items: {
        create: {
          product: { connect: { slug: "xiaomi-mi-air-purifier-4" } },
          price: 14999,
          quantity: 1,
          name: "Xiaomi Mi Air Purifier 4",
          image: "/products/xiaomi-air-purifier-4-1.jpg",
        },
      },
    },
  });

  console.log(`✅ Создано 3 заказа`);

  // 7. Создание списков желаемого
  console.log("❤️  Создание списков желаемого...");

  await prisma.wishlist.create({
    data: {
      user: { connect: { id: user.id } },
      product: { connect: { slug: "sony-kd-55x80j" } },
    },
  });

  await prisma.wishlist.create({
    data: {
      user: { connect: { id: user.id } },
      product: { connect: { slug: "iphone-15-pro" } },
    },
  });

  await prisma.wishlist.create({
    data: {
      user: { connect: { id: user2.id } },
      product: { connect: { slug: "macbook-air-m2" } },
    },
  });

  console.log(`✅ Создано 3 элемента в избранном`);

  console.log("\n🎉 Сидирование завершено успешно!");
  console.log("\n📋 Данные для входа:");
  console.log("👤 Админ: admin@shop.com / admin123");
  console.log("👤 Пользователь: user@example.com / user123");
  console.log("👤 Пользователь 2: maria@example.com / user123");
}

// ---------------- ЗАПУСК ----------------

main()
  .catch((e) => {
    console.error("❌ Ошибка при сидировании:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
