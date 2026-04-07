"use client";
import { Tag, Loader2, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useState } from "react";
import { Badge } from "../../ui/badge";
import { toast } from "sonner";

interface PromoResult {
  code: string;
  discount: number;
  finalAmount: number;
}
interface CheckoutPromoInputProps {
  cartSubtotal: number;
  onPromoApplied: (promo: PromoResult) => void;
  onPromoRemoved: () => void;
}

export function CheckoutPromoInput({
  cartSubtotal,
  onPromoApplied,
  onPromoRemoved,
}: CheckoutPromoInputProps) {
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoResult | null>(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  const handleCheckPromo = async () => {
    if (!promoInput.trim()) return;

    setIsCheckingPromo(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoInput.trim(),
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
        finalAmount: data.finalAmount,
      };
      setPromo(promoResult);
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
    setPromo(null);
    setPromoInput("");
    onPromoRemoved();
  };
  if (promo) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-green-600" aria-hidden="true" />
          <span className="font-medium text-sm text-green-700">
            {promo.code}
          </span>
          <Badge variant="secondary" className="text-xs">
            -{promo.discount.toLocaleString()} ₽
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
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Промокод"
        value={promoInput}
        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
        className="h-9"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCheckPromo}
        disabled={isCheckingPromo || !promoInput.trim()}
      >
        {isCheckingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "OK"}
      </Button>
    </div>
  );
}
