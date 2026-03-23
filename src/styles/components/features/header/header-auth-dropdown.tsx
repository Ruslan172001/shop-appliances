import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu";
import { User } from "lucide-react";
import { Label } from "../../ui/label";
import Link from "next/link";
export default function HeaderAuthDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Label>
          <User className="mr-2 h-4 w-4" />
          <span>Войти</span>
        </Label>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem>
          <Link href="/login">Войти</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/register">Зарегистрироваться</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
