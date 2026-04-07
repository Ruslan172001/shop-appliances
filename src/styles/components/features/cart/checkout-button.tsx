import Link from "next/link";
import { Button } from "../../ui/button";
export default function CheckoutButton() {
  return (
    <Link href="/checkout">
      <Button className="flex-1 w-full">Оформить заказ</Button>
    </Link>
  );
}
