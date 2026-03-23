import Link from "next/link";

export default function CheckoutButton() {
  return (
    <Link href="/checkout" className="btn btn-primary">
      Оформить заказ
    </Link>
  );
}
