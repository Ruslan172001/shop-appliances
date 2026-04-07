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

import Link from "next/link";
import { login } from "@/actions/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Вход в аккаунт</CardTitle>
          <CardDescription>
            Введите ваш email ниже для входа в аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
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
                    state?.errors?.password ? "password-error" : undefined
                  }
                />
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
                  {pending ? "Вход..." : "Войти"}
                </Button>
                <FieldDescription className="text-center">
                  Нет аккаунта?{" "}
                  <Link href="/register" className="underline">
                    Зарегистрироваться
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
