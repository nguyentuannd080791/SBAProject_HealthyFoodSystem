import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { INTERNAL_ROLES } from "../utils/roles";
import { validateCreateAccountValues } from "../utils/validators";

const emptyValues = {
  fullName: "",
  email: "",
  phone: "",
  role: "staff",
  password: "",
  confirmPassword: "",
};

export function CreateAccountForm({
  onSubmit,
  onCancel,
  submitError,
  isSubmitting,
}) {
  const form = useForm(emptyValues, validateCreateAccountValues);

  function handleFormSubmit(values) {
    const { confirmPassword: _confirmPassword, ...payload } = values;
    onSubmit(payload);
  }

  return (
    <Form noValidate onSubmit={form.handleSubmit(handleFormSubmit)}>
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <FormField
        label="Họ và tên"
        name="fullName"
        placeholder="Nhập họ và tên"
        value={form.values.fullName}
        error={form.errors.fullName}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />

      <Row>
        <Col md={6}>
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="example@healthy.vn"
            value={form.values.email}
            error={form.errors.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>
        <Col md={6}>
          <FormField
            label="Số điện thoại"
            name="phone"
            type="tel"
            placeholder="0912345678"
            value={form.values.phone}
            error={form.errors.phone}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="role">
        <Form.Label>Vai trò</Form.Label>
        <Form.Select
          name="role"
          value={form.values.role}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          isInvalid={Boolean(form.errors.role)}
        >
          {INTERNAL_ROLES.map((r) => (
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

      <Row>
        <Col md={6}>
          <FormField
            label="Mật khẩu"
            name="password"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={form.values.password}
            error={form.errors.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>
        <Col md={6}>
          <FormField
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.values.confirmPassword}
            error={form.errors.confirmPassword}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
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
          {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
        </Button>
      </div>
    </Form>
  );
}
