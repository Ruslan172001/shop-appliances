import { Button } from "../../ui/button";

export default function QuantityControl() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        -
      </Button>
      <span>1</span>
      <Button variant="outline" size="sm">
        +
      </Button>
    </div>
  );
}
