import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatPrice,
  truncate,
  getInitials,
} from "./user-utils";

describe("formatDate", () => {
  it("форматирует Date объект", () => {
    expect(formatDate(new Date("2026-03-30"))).toMatch(/30 марта 2026/);
  });

  it("форматирует ISO строку", () => {
    expect(formatDate("2024-12-01T00:00:00Z")).toMatch(/1 декабря 2024/);
  });

  it("форматирует timestamp (число)", () => {
    const ts = new Date("2026-05-02").getTime();
    expect(formatDate(ts)).toMatch(/2 мая 2026/);
  });
});

describe("formatDateTime", () => {
  it("добавляет время к дате", () => {
    const result = formatDateTime("2026-03-30T14:30:00Z");

    expect(result).toMatch(/30 марта 2026.*\d{2}:\d{2}/);
  });
});

describe("formatRelativeTime", () => {
  const FIXED_NOW = new Date("2026-05-02T15:30:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("возвращает 'только что' для < 60 сек", () => {
    expect(formatRelativeTime("2026-05-02T15:29:30Z")).toBe("только что");
  });

  it("возвращает минуты для < 1 часа", () => {
    expect(formatRelativeTime("2026-05-02T15:00:00Z")).toBe("30 мин. назад");
  });

  it("возвращает часы для < 1 дня", () => {
    expect(formatRelativeTime("2026-05-02T10:30:00Z")).toBe("5 ч. назад");
  });

  it("возвращает дни для < 1 недели", () => {
    expect(formatRelativeTime("2026-04-30T15:30:00Z")).toBe("2 дн. назад");
  });

  it("возвращает полную дату для > 1 недели", () => {
    const result = formatRelativeTime("2026-04-20T15:30:00Z");
    expect(result).toMatch(/20 апреля 2026/);
  });

  it("корректно обрабатывает граничные значения", () => {
    // ровно 60 секунд
    expect(formatRelativeTime("2026-05-02T15:29:00Z")).toBe("1 мин. назад");
    // ровно 1 час
    expect(formatRelativeTime("2026-05-02T14:30:00Z")).toBe("1 ч. назад");
  });
});

describe("formatPrice", () => {
  it("форматирует целое число", () => {
    const result = formatPrice(1299).replace(/\s/g, " ");
    expect(result).toBe("1 299 ₽");
  });

  it("форматирует большие числа", () => {
    const result = formatPrice(1000000).replace(/\s/g, " ");
    expect(result).toBe("1 000 000 ₽");
  });

  it("округляет дробные значения до целых рублей", () => {
    const result = formatPrice(999.5).replace(/\s/g, " ");
    expect(result).toBe("1 000 ₽"); // 👈 999.5 округляется до 1000
  });

  it("корректно обрабатывает 0", () => {
    const result = formatPrice(0).replace(/\s/g, " ");
    expect(result).toBe("0 ₽");
  });
});

describe("truncate", () => {
  it("возвращает исходный текст, если длина <= maxLength", () => {
    expect(truncate("Привет", 10)).toBe("Привет");
    expect(truncate("Тест", 4)).toBe("Тест");
  });

  it("обрезает текст и добавляет многоточие", () => {
    expect(truncate("Длинный текст для теста", 10)).toBe("Длинный те…");
  });

  it("корректно работает с maxLength = 0", () => {
    expect(truncate("Любой текст", 0)).toBe("…");
  });

  it("сохраняет пробелы и спецсимволы при обрезке", () => {
    expect(truncate("a b c d e f", 7)).toBe("a b c d…");
  });
});

describe("getInitials", () => {
  it("генерирует инициалы из полного имени", () => {
    expect(getInitials("Иван Петров")).toBe("ИП");
  });

  it("приводит к верхнему регистру", () => {
    expect(getInitials("иван петров")).toBe("ИП");
    expect(getInitials("Анна Сергеевна")).toBe("АС");
  });

  it("работает с одним словом", () => {
    expect(getInitials("Алексей")).toBe("А");
  });

  it("берёт только первые два слова", () => {
    expect(getInitials("Иван Иванович Петров")).toBe("ИИ");
  });

  it("корректно обрабатывает пустую строку", () => {
    expect(getInitials("")).toBe("");
  });

  it("игнорирует лишние пробелы", () => {
    expect(getInitials("  Мария  Сидорова  ")).toBe("МС");
  });
});
