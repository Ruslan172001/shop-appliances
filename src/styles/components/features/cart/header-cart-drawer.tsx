import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { ShoppingCart } from "lucide-react";
export default function HeaderCartDrawer() {
  return (
    <Sheet>
      <SheetTrigger>
        <ShoppingCart />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>Add items to your shopping cart.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
