import * as z from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Имя должно быть не менее 2 символов" })
    .trim(),
  email: z.email({ error: "Некорректный email" }).trim(),
  password: z
    .string()
    .min(8, { error: "Пароль должен быть не менее 8 символов" })
    .regex(/[a-zA-Z]/, { error: "Должен содержать буквы" })
    .regex(/[0-9]/, { error: "Должен содержать цифры" })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Должен содержать спецсимволы",
    })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const loginSchema = z.object({
  email: z.email({ error: "Некорректный email" }).trim(),
  password: z.string().min(1, { error: "Введите пароль" }),
});

export const registerSchema = SignupFormSchema;
