"use client";

import { Button } from "@/styles/components/ui/button";
import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 border-b bg-background/95 backdrop-blur">
      <div>
        <h1 className="text-xl font-semibold">Админ-панель</h1>
      </div>
      <div className="flex items-center ga-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" aria-hidden="true" />
          <span>{session?.user?.name || "Администратор"}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Выход <LogOut className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
