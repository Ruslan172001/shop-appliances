import * as z from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "Введите имя"),
  lastName: z.string().min(1, "Введите фамилию"),
  phone: z.string().min(6, "Введите номер телефона"),
  email: z.string().email("Введите корректный email"),
  city: z.string().min(1, "Введите город"),
  address: z.string().min(5, "Введите адрес(минимум 5 символов)"),
  comment: z.string().optional(),
  paymentMethod: z.enum(["cash", "card", "online"]).default("card"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
