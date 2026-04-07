"use client";

import { useActionState } from "react";
import { updateProfile, ProfileFormState } from "@/actions/profile";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { Edit, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Session } from "next-auth";

interface EditProfileDialogProps {
  user: Session["user"];
}

export function EditProfileDialog({ user }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    {} as ProfileFormState,
  );

  const isSuccess = state?.success;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          // Экран успеха
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <DialogHeader>
              <DialogTitle>Готово!</DialogTitle>
              <DialogDescription>
                Ваш профиль успешно обновлён.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Закрыть</Button>
            </DialogFooter>
          </div>
        ) : (
          // Форма редактирования
          <>
            <DialogHeader>
              <DialogTitle>Редактировать профиль</DialogTitle>
              <DialogDescription>
                Измените имя, email или пароль
              </DialogDescription>
            </DialogHeader>

            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя</label>
                <Input
                  name="name"
                  defaultValue={user.name || ""}
                  placeholder="Ваше имя"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={user.email || ""}
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <Separator />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground"
              >
                {showPassword ? "Скрыть смену пароля" : "Сменить пароль"}
              </Button>

              {showPassword && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Текущий пароль
                    </label>
                    <Input name="currentPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Новый пароль</label>
                    <Input name="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Подтвердите новый пароль
                    </label>
                    <Input name="confirmPassword" type="password" />
                  </div>
                </div>
              )}

              {state?.error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  {state.error}
                </div>
              )}

              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Сохранить"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
