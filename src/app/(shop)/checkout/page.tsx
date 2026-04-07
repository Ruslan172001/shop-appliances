"use client";

import { useActionState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { createOrder, OrderFormState } from "@/actions/order";
import { Spinner } from "@/styles/components/ui/spinner";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  CheckoutAddressForm,
  CheckoutContactInfo,
  CheckoutOrderSummary,
  CheckoutPaymentMethods,
  CheckoutSuccess,
} from "@/styles/components/features/checkout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { data: items = [], isLoading } = useCart();
  const [state, formAction, isPending] = useActionState(
    createOrder,
    {} as OrderFormState,
  );

  useEffect(() => {
    if (state?.confirmationUrl) {
      window.location.href = state.confirmationUrl;
    }
  }, [state?.confirmationUrl]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0 && !state?.orderId) {
    redirect("/cart");
  }

  if (state?.orderId && !state?.confirmationUrl) {
    return (
      <CheckoutSuccess orderId={state.orderId} discount={state.discount} />
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

      <form action={formAction} aria-busy={isPending}>
        <input type="hidden" name="userId" value={session?.user?.id || ""} />
        <input type="hidden" name="promoCode" value="" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CheckoutContactInfo />
            <CheckoutAddressForm />

            <Card>
              <CardHeader>
                <CardTitle>Способ оплаты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CheckoutPaymentMethods />
              </CardContent>
            </Card>

            {state?.error && (
              <div
                className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                {state.error}
              </div>
            )}
          </div>

          <div>
            <CheckoutOrderSummary items={items} isPending={isPending} />
          </div>
        </div>
      </form>
    </div>
  );
}
