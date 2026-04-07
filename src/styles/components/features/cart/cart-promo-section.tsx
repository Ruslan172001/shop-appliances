"use client";

import { useState } from "react";
import { Tag, Loader2, X } from "lucide-react";
import { Button } from "@/styles/components/ui/button";
import { Input } from "@/styles/components/ui/input";
import { Badge } from "@/styles/components/ui/badge";
import { toast } from "sonner";

interface PromoResult {
  code: string;
  discount: number;
}

interface CartPromoSectionProps {
  cartSubtotal: number;
  onPromoApplied: (promo: PromoResult) => void;
  onPromoRemoved: () => void;
}

export function CartPromoSection({
  cartSubtotal,
  onPromoApplied,
  onPromoRemoved,
}: CartPromoSectionProps) {
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoResult | null>(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    setIsCheckingPromo(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCodeInput.trim(),
          cartTotal: cartSubtotal,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      const promoResult: PromoResult = {
        code: data.code,
        discount: data.discount,
      };
      setAppliedPromo(promoResult);
      onPromoApplied(promoResult);
      toast.success(
        `Промокод применён! Скидка: ${data.discount.toLocaleString()} ₽`,
      );
    } catch {
      toast.error("Ошибка проверки промокода");
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    onPromoRemoved();
  };

  if (appliedPromo) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-green-600" aria-hidden="true" />
          <span className="font-medium text-sm text-green-700">
            {appliedPromo.code}
          </span>
          <Badge variant="secondary" className="text-xs">
            -{appliedPromo.discount.toLocaleString()} ₽
          </Badge>
        </div>
        <button
          type="button"
          onClick={handleRemovePromo}
          aria-label="Удалить промокод"
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApplyPromo} className="flex gap-2">
      <label htmlFor="cart-promo-input" className="sr-only">
        Промокод
      </label>
      <Input
        id="cart-promo-input"
        type="text"
        placeholder="Промокод"
        value={promoCodeInput}
        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
        className="h-9"
      />
      <Button
        type="submit"
        variant="outline"
        size="sm"
        disabled={isCheckingPromo || !promoCodeInput.trim()}
      >
        {isCheckingPromo ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "OK"
        )}
      </Button>
    </form>
  );
}
