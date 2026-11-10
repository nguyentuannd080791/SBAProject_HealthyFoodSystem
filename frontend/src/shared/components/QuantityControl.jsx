import { Button, ButtonGroup } from "react-bootstrap";

export function QuantityControl({ quantity, onChange, min = 1, max = Infinity, name = "món ăn", disabled = false }) {
  return (
    <ButtonGroup aria-label={`Số lượng ${name}`} className="align-items-center">
      <Button variant="outline-secondary" disabled={disabled || quantity <= min}
        aria-label={`Giảm số lượng ${name}`} onClick={() => onChange(quantity - 1)}>−</Button>
      <output className="px-3 text-center" style={{ minWidth: 48 }} aria-live="polite">{quantity}</output>
      <Button variant="outline-secondary" disabled={disabled || quantity >= max} aria-label={`Tăng số lượng ${name}`}
        onClick={() => onChange(quantity + 1)}>+</Button>
    </ButtonGroup>
  );
}
