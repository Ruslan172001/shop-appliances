"use client";

import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Textarea } from "../../ui/textarea";

export function CheckoutAddressForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Адрес доставки</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="checkout-city" className="text-sm font-medium">
            Город
          </label>
          <Input
            id="checkout-city"
            type="text"
            name="city"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="checkout-address" className="text-sm font-medium">
            Адрес
          </label>
          <Input
            id="checkout-address"
            type="text"
            name="address"
            placeholder="Улица, дом, квартира"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="checkout-comment" className="text-sm font-medium">
            Комментарий
          </label>
          <Textarea
            id="checkout-comment"
            name="comment"
            placeholder="Комментарий к заказу"
          />
        </div>
      </CardContent>
    </Card>
  );
}
