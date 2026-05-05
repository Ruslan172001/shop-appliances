import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

global.React = React;

// Подавляем консоль в тестах (опционально)
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
};

// Глобальный мок для прерывания реальных запросов к БД
vi.mock("@/lib/prisma", () => ({
  default: {
    $transaction: vi.fn((cb) =>
      cb({
        order: { create: vi.fn() },
        orderItem: { create: vi.fn() },
        product: { update: vi.fn() },
        cartItem: { deleteMany: vi.fn() },
      }),
    ),
  },
}));
