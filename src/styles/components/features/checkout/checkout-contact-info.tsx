"use client";

import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function CheckoutContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Контактные данные</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="checkout-first-name"
              className="text-sm font-medium"
            >
              Имя
            </label>
            <Input
              id="checkout-first-name"
              type="text"
              name="firstName"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="checkout-last-name" className="text-sm font-medium">
              Фамилия
            </label>
            <Input
              id="checkout-last-name"
              type="text"
              name="lastName"
              required
              aria-required="true"
            />
          </div>
        </div>
        <div>
          <label htmlFor="checkout-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="checkout-email"
            type="email"
            name="email"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="checkout-phone" className="text-sm font-medium">
            Телефон
          </label>
          <Input
            id="checkout-phone"
            type="tel"
            name="phone"
            required
            aria-required="true"
          />
        </div>
      </CardContent>
    </Card>
  );
}
