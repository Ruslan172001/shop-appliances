"use client";

import { HomepagePromo } from "@/lib/promo-service";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "./card";
import { Badge, Check, Copy, Gift } from "lucide-react";
import { Button } from "./button";

export function PromoBanner({ promo }: { promo: HomepagePromo }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      toast.success("Промокод скопирован в буфер");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать код");
    }
  };

  const discountText =
    promo.type === "PERCENT"
      ? `-${promo.value}%`
      : `-${promo.value.toLocaleString()} ₽`;

  return (
    <Card className="w-full items-center border-primary/20 bg-linear-to-r from-primary/5 to-transparent py-4">
      <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Gift className="w-7 h-7 text-primary shrink-0" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg">
              Специальное предложение
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {promo.description || "Скидка на весь ассортимент"}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full md:w-auto">
          <Badge className="text-xs text-muted-foreground whitespace-nowrap">
            {promo.code}
          </Badge>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            от {promo.minOrderAmount.toLocaleString()} ₽
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 w-full md:w-auto">
          <span className="text-xl font-bold text-primary">{discountText}</span>
          <Button
            onClick={handleCopy}
            variant={copied ? "outline" : "default"}
            size="sm"
            className="w-full sm:w-auto transition-all"
            disabled={copied}
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Скопировано" : "Копировать"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
