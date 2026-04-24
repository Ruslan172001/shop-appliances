"use client";

import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { register } from "@/actions/auth";

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
                  aria-required="true"
                  aria-describedby={
                    state?.errors?.name ? "name-error" : undefined
                  }
                />
              </Field>
              {state?.errors?.name && (
                <FieldDescription
                  id="name-error"
                  className="text-destructive"
                  role="alert"
                >
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
                  aria-required="true"
                  aria-describedby={
                    state?.errors?.email ? "email-error" : undefined
                  }
                />
              </Field>
              {state?.errors?.email && (
                <FieldDescription
                  id="email-error"
                  className="text-destructive"
                  role="alert"
                >
                  {state.errors.email[0]}
                </FieldDescription>
              )}
              <Field>
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  aria-required="true"
                  aria-describedby={
                    [
                      state?.errors?.password ? "password-error" : "",
                      "password-hint",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                />
                <FieldDescription
                  id="password-hint"
                  className="text-muted-foreground"
                >
                  Минимум 8 символов, буквы, цифры и спецсимволы
                </FieldDescription>
              </Field>
              {state?.errors?.password && (
                <FieldDescription
                  id="password-error"
                  className="text-destructive"
                  role="alert"
                >
                  {state.errors.password[0]}
                </FieldDescription>
              )}
              {state?.message && (
                <FieldDescription className="text-destructive" role="alert">
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
