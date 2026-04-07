import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";

export default function HeaderAuthDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label="Войти или зарегистрироваться">
          <User className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Войти</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/login" className="w-full">
            Войти
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/register" className="w-full">
            Зарегистрироваться
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
