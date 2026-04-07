import { Banknote, CreditCard, Globe, LucideIcon } from "lucide-react";

interface PaymentMethod {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  defaultChecked?: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "payment-card",
    value: "card",
    label: "Картой при получении",
    description: "Оплата картой курьеру при доставке",
    icon: CreditCard,
    defaultChecked: true,
  },
  {
    id: "payment-bank",
    value: "bank",
    label: "Банковскими картами",
    description: "Оплата банковскими картами",
    icon: Banknote,
  },
  {
    id: "payment-internet",
    value: "internet",
    label: "Оплата онлайн",
    description: "Оплата онлайн",
    icon: Globe,
  },
];
export function CheckoutPaymentMethods() {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Способ оплаты</legend>
      {PAYMENT_METHODS.map((method) => (
        <label
          key={method.id}
          htmlFor={method.id}
          className="relative flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent has-checked:border-primary has-checked:bg-accent"
        >
          <input
            id={method.id}
            type="radio"
            name="paymentMethod"
            value={method.value}
            defaultChecked={method.defaultChecked}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <method.icon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">{method.label}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {method.description}
            </p>
          </div>
        </label>
      ))}
    </fieldset>
  );
}
