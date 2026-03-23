"use client";

import { cn } from "@/styles/lib/utils";
import { Button } from "@/styles/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/styles/components/ui/field";
import { Input } from "@/styles/components/ui/input";
import { useActionState } from "react";
import { register } from "actions/auth";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, pending] = useActionState(register, undefined);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>
            Заполните форму ниже для создания аккаунта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Имя</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Иван Иванов"
                  required
                />
              </Field>
              {state?.errors?.name && (
                <FieldDescription className="text-destructive">
                  {state.errors.name[0]}
                </FieldDescription>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              {state?.errors?.email && (
                <FieldDescription className="text-destructive">
                  {state.errors.email[0]}
                </FieldDescription>
              )}
              <Field>
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <Input id="password" type="password" name="password" required />
                <FieldDescription className="text-muted-foreground">
                  Минимум 8 символов, буквы, цифры и спецсимволы
                </FieldDescription>
              </Field>
              {state?.errors?.password && (
                <FieldDescription className="text-destructive">
                  {state.errors.password[0]}
                </FieldDescription>
              )}
              {state?.message && (
                <FieldDescription className="text-destructive">
                  {state.message}
                </FieldDescription>
              )}
              <Field>
                <Button disabled={pending} type="submit" className="w-full">
                  {pending ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
                <FieldDescription className="text-center">
                  Уже есть аккаунт?{" "}
                  <Link href="/login" className="underline">
                    Войти
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
