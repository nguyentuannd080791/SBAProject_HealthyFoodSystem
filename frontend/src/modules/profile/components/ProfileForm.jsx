import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { validateProfileValues } from "../utils/validators";

export function ProfileForm({
  profile,
  onSubmit,
  submitError,
  isSubmitting,
}) {
  const initialValues = { fullName: profile.fullName || "", phone: profile.phone || "" };
  const form = useForm(initialValues, validateProfileValues);

  return (
    <Form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      {submitError && (
        <Alert variant="danger" className="py-2 small mb-3">
          {submitError}
        </Alert>
      )}

      <Row className="g-3">
        <Col xs={12} md={6}>
          <FormField
            label="Họ và tên"
            name="fullName"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            value={form.values.fullName}
            error={form.errors.fullName}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>

        <Col xs={12} md={6}>
          <FormField
            label="Số điện thoại liên hệ"
            name="phone"
            type="tel"
            placeholder="0912345678"
            autoComplete="tel"
            value={form.values.phone}
            error={form.errors.phone}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>

        <Col xs={12}>
          <FormField
            label="Địa chỉ Email"
            name="email"
            type="email"
            disabled
            hint="Email liên kết với tài khoản đăng nhập của bạn (không thể chỉnh sửa trực tiếp)."
            value={profile.email}
          />
        </Col>
      </Row>

      <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
        <span className="small text-muted">
          Thông tin liên hệ được sử dụng để xác nhận đơn hàng và giao nhận thực phẩm.
        </span>
        <Button
          type="submit"
          variant="primary"
          className="px-4 py-2 fw-semibold rounded-pill"
          disabled={isSubmitting}
          style={{
            backgroundColor: "var(--hf-primary)",
            borderColor: "var(--hf-primary)",
          }}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </Form>
  );
}
