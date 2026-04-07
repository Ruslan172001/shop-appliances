export function ProductDeliveryInfo() {
  return (
    <div className="border-t pt-4 space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="text-muted-foreground"
          role="img"
          aria-label="Доставка"
        >
          🚚
        </span>
        <span>Доставка: от 299 ₽</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground" role="img" aria-label="Возврат">
          🔄
        </span>
        <span>Возврат: 14 дней</span>
      </div>
    </div>
  );
}
