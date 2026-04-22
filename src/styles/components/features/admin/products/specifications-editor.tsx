"use client";

import { useState } from "react";
import { Button } from "@/styles/components/ui/button";
import { Input } from "@/styles/components/ui/input";
import { Label } from "@/styles/components/ui/label";
import { Plus, X } from "lucide-react";

interface SpecificationsEditorProps {
  specifications: Record<string, string | number | boolean | null>;
  onChange: (specs: Record<string, string | number | boolean | null>) => void;
}

export function SpecificationsEditor({
  specifications,
  onChange,
}: SpecificationsEditorProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const addSpecification = () => {
    if (!newKey.trim() || !newValue.trim()) return;

    // Пробуем определить тип значения
    let parsedValue: string | number | boolean | null = newValue;
    if (newValue.toLowerCase() === "true") parsedValue = true;
    else if (newValue.toLowerCase() === "false") parsedValue = false;
    else if (!isNaN(Number(newValue))) parsedValue = Number(newValue);

    onChange({
      ...specifications,
      [newKey.trim()]: parsedValue,
    });
    setNewKey("");
    setNewValue("");
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    onChange(newSpecs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Характеристики</Label>
      </div>

      {/* Добавление новой характеристики */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="spec-key" className="text-xs">
            Название
          </Label>
          <Input
            id="spec-key"
            placeholder="Например: Вес"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecification())}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="spec-value" className="text-xs">
            Значение
          </Label>
          <Input
            id="spec-value"
            placeholder="Например: 5.2 кг"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecification())}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSpecification}
          disabled={!newKey.trim() || !newValue.trim()}
          aria-label="Добавить характеристику"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Список характеристик */}
      {Object.keys(specifications).length > 0 && (
        <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
          {Object.entries(specifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 gap-2"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{key}:</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {String(value)}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSpecification(key)}
                aria-label={`Удалить характеристику ${key}`}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
