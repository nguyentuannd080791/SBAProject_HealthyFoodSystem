import { Alert, Button, Form } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { validateResetPasswordValues } from "../utils/validators";

export function ResetPasswordForm({
  initialEmail,
  onSubmit,
  notice,
  submitError,
  isSubmitting,
}) {
  const initialValues = {
    email: initialEmail,
    code: "",
    password: "",
    confirmPassword: "",
  };
  const form = useForm(initialValues, validateResetPasswordValues);

  function submitTrimmed(values) {
    onSubmit({
      ...values,
      email: values.email.trim(),
      code: values.code.trim(),
    });
  }

  return (
    <Form noValidate onSubmit={form.handleSubmit(submitTrimmed)}>
      {notice && (
        <Alert variant="info" className="py-2 small">
          {notice}
        </Alert>
      )}
      {submitError && (
        <Alert variant="danger" className="py-2 small">
          {submitError}
        </Alert>
      )}

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="name@example.com"
        autoComplete="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <FormField
        label="Mã xác thực OTP"
        name="code"
        inputMode="numeric"
        maxLength={6}
        placeholder="123456"
        autoComplete="one-time-code"
        hint="Nhập mã gồm 6 chữ số đã được gửi tới email của bạn."
        value={form.values.code}
        error={form.errors.code}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <FormField
        label="Mật khẩu mới"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Tối thiểu 8 ký tự, gồm cả chữ và số."
        value={form.values.password}
        error={form.errors.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <FormField
        label="Nhập lại mật khẩu mới"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        value={form.values.confirmPassword}
        error={form.errors.confirmPassword}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />

      <Button
        variant="primary"
        type="submit"
        className="w-100 mt-3 py-2 fw-semibold"
        disabled={isSubmitting}
        style={{
          backgroundColor: "var(--hf-primary)",
          borderColor: "var(--hf-primary)",
        }}
      >
        {isSubmitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
      </Button>
    </Form>
  );
}
