import { Button } from "../../ui/button";
import { Plus as PlusIcon, Minus as MinusIcon } from "lucide-react";
interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantityControl({
  quantity,
  onQuantityChange,
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={quantity <= 1}
      >
        <MinusIcon />
      </Button>
      <span className="text-sm font-semibold">{quantity}</span>
      <Button onClick={() => onQuantityChange(quantity + 1)}>
        <PlusIcon />
      </Button>
    </div>
  );
}
