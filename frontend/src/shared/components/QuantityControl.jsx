import { Button, ButtonGroup } from "react-bootstrap";

export function QuantityControl({ quantity, onChange, min = 1, name = "món ăn" }) {
  return (
    <ButtonGroup aria-label={`Số lượng ${name}`} className="align-items-center">
      <Button variant="outline-secondary" disabled={quantity <= min}
        aria-label={`Giảm số lượng ${name}`} onClick={() => onChange(quantity - 1)}>−</Button>
      <output className="px-3 text-center" style={{ minWidth: 48 }} aria-live="polite">{quantity}</output>
      <Button variant="outline-secondary" aria-label={`Tăng số lượng ${name}`}
        onClick={() => onChange(quantity + 1)}>+</Button>
    </ButtonGroup>
  );
}
