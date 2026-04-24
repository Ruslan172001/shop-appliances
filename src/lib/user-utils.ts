/**
 * Форматировать дату в русском формате
 * @param date Дата или строка даты
 * @returns Отформатированная строка (например, "30 марта 2026")
 */
export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Форматировать дату с временем
 * @param date Дата или строка даты
 * @returns Отформатированная строка (например, "30 марта 2026, 14:30")
 */
export function formatDateTime(date: Date | string | number): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Форматировать относительную дату (например, "2 часа назад")
 * @param date Дата или строка даты
 * @returns Относительная строка времени
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "только что";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} мин. назад`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} дн. назад`;

  return formatDate(date);
}

/**
 * Форматировать цену в рубли
 * @param price Цена
 * @returns Строка с форматированной ценой (например, "1 299 ₽")
 */
export function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  });
}

/**
 * Обрезать текст до определённой длины
 * @param text Текст
 * @param maxLength Максимальная длина
 * @returns Обрезанный текст с многоточием
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

/**
 * Сгенерировать инициалы из имени
 * @param name Полное имя
 * @returns Инициалы (например, "ИП" для "Иван Петров")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}
