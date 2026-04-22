"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/styles/components/ui/button";
import { Input } from "@/styles/components/ui/input";
import { Textarea } from "@/styles/components/ui/textarea";
import { Label } from "@/styles/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/components/ui/select";
import { Switch } from "@/styles/components/ui/switch";
import { Separator } from "@/styles/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultValidUntilIso() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString();
}

export interface PromoCodeFormInitial {
  code: string;
  type: "PERCENT" | "FIXED";
  value: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  validFrom: string;
  validUntil: string;
  usageLimit: string;
  usageCount?: number;
  isActive: boolean;
  description: string;
}

interface PromoCodeFormProps {
  mode: "create" | "edit";
  initial?: PromoCodeFormInitial;
  promoId?: string;
}

export function PromoCodeForm({ mode, initial, promoId }: PromoCodeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nowIso = new Date().toISOString();
  const [form, setForm] = useState<PromoCodeFormInitial>(() =>
    initial ?? {
      code: "",
      type: "PERCENT",
      value: "10",
      minOrderAmount: "0",
      maxDiscountAmount: "",
      validFrom: toDatetimeLocalValue(nowIso),
      validUntil: toDatetimeLocalValue(defaultValidUntilIso()),
      usageLimit: "0",
      isActive: true,
      description: "",
    },
  );

  const update = <K extends keyof PromoCodeFormInitial>(
    key: K,
    value: PromoCodeFormInitial[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code: form.code.trim(),
        type: form.type,
        value: Number(form.value.replace(",", ".")),
        minOrderAmount: Number(form.minOrderAmount.replace(",", ".")),
        maxDiscountAmount: form.maxDiscountAmount.trim()
          ? Number(form.maxDiscountAmount.replace(",", "."))
          : null,
        validFrom: new Date(form.validFrom).toISOString(),
        validUntil: new Date(form.validUntil).toISOString(),
        usageLimit: parseInt(form.usageLimit, 10) || 0,
        isActive: form.isActive,
        description: form.description.trim() || null,
      };

      const url =
        mode === "create"
          ? "/api/admin/promo-codes"
          : `/api/admin/promo-codes/${promoId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const errText = await res.text();

      if (!res.ok) {
        toast.error(errText || "Ошибка сохранения");
        return;
      }

      toast.success(mode === "create" ? "Промокод создан" : "Сохранено");
      router.push("/admin/promo-codes");
      router.refresh();
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="promo-code">Код</Label>
        <Input
          id="promo-code"
          value={form.code}
          onChange={(e) => update("code", e.target.value.toUpperCase())}
          placeholder="SALE2026"
          required
          minLength={2}
          className="font-mono"
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Клиенты вводят код без учёта регистра; сохраняется в верхнем регистре.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Тип скидки</Label>
          <Select
            value={form.type}
            onValueChange={(v) => update("type", v as "PERCENT" | "FIXED")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENT">Процент (%)</SelectItem>
              <SelectItem value="FIXED">Фиксированная сумма (₽)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="promo-value">
            Значение {form.type === "PERCENT" ? "(%)" : "(₽)"}
          </Label>
          <Input
            id="promo-value"
            type="number"
            min={0.01}
            step={form.type === "PERCENT" ? 1 : 1}
            max={form.type === "PERCENT" ? 100 : undefined}
            value={form.value}
            onChange={(e) => update("value", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="promo-min">Минимальная сумма заказа (₽)</Label>
          <Input
            id="promo-min"
            type="number"
            min={0}
            step={1}
            value={form.minOrderAmount}
            onChange={(e) => update("minOrderAmount", e.target.value)}
            required
          />
        </div>
        {form.type === "PERCENT" && (
          <div className="space-y-2">
            <Label htmlFor="promo-max">Макс. скидка (₽), опционально</Label>
            <Input
              id="promo-max"
              type="number"
              min={0}
              step={1}
              placeholder="Без ограничения"
              value={form.maxDiscountAmount}
              onChange={(e) => update("maxDiscountAmount", e.target.value)}
            />
          </div>
        )}
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="promo-from">Действует с</Label>
          <Input
            id="promo-from"
            type="datetime-local"
            value={form.validFrom}
            onChange={(e) => update("validFrom", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="promo-until">Действует до</Label>
          <Input
            id="promo-until"
            type="datetime-local"
            value={form.validUntil}
            onChange={(e) => update("validUntil", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="promo-limit">Лимит активаций</Label>
          <Input
            id="promo-limit"
            type="number"
            min={0}
            step={1}
            value={form.usageLimit}
            onChange={(e) => update("usageLimit", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">0 — без ограничений</p>
        </div>
        {mode === "edit" && form.usageCount !== undefined && (
          <div className="space-y-2">
            <Label>Уже использован</Label>
            <Input
              value={String(form.usageCount)}
              readOnly
              className="bg-muted"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="promo-active">Промокод активен</Label>
          <p className="text-xs text-muted-foreground">
            Выключенные коды не применяются в корзине
          </p>
        </div>
        <Switch
          id="promo-active"
          checked={form.isActive}
          onCheckedChange={(v) => update("isActive", v)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promo-desc">Описание (внутреннее)</Label>
        <Textarea
          id="promo-desc"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Например: весенняя распродажа"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Создать" : "Сохранить"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/promo-codes")}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
