import { Form } from "react-bootstrap";

export function FormField({ label, name, error, hint, id, ...inputProps }) {
  const fieldId = id || name || inputProps.name;

  return (
    <Form.Group className="mb-3" controlId={fieldId}>
      {label && <Form.Label className="small fw-semibold text-secondary">{label}</Form.Label>}
      <Form.Control name={name} isInvalid={Boolean(error)} {...inputProps} />
      {hint && <Form.Text muted className="small">{hint}</Form.Text>}
      <Form.Control.Feedback type="invalid" role="alert">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
