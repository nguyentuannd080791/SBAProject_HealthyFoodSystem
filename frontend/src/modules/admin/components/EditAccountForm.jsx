import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { ROLES } from "../utils/roles";
import { validateEditAccountValues } from "../utils/validators";

export function EditAccountForm({
  user,
  onSubmit,
  onCancel,
  submitError,
  isSubmitting,
}) {
  const initialValues = {
    fullName: user.fullName || "",
    phone: user.phone || "",
    role: user.role || "staff",
    status: user.status || "active",
  };

  const form = useForm(initialValues, validateEditAccountValues);

  return (
    <Form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <FormField
        label="Email"
        name="email"
        type="email"
        value={user.email}
        disabled
        hint="Email không thể thay đổi."
      />

      <Row>
        <Col md={6}>
          <FormField
            label="Họ và tên"
            name="fullName"
            value={form.values.fullName}
            error={form.errors.fullName}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>
        <Col md={6}>
          <FormField
            label="Số điện thoại"
            name="phone"
            type="tel"
            value={form.values.phone}
            error={form.errors.phone}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Vai trò</Form.Label>
            <Form.Select
              name="role"
              value={form.values.role}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              isInvalid={Boolean(form.errors.role)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Form.Select>
            {form.errors.role && (
              <Form.Control.Feedback type="invalid">
                {form.errors.role}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="status">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select
              name="status"
              value={form.values.status}
              onChange={form.handleChange}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </Form>
  );
}
