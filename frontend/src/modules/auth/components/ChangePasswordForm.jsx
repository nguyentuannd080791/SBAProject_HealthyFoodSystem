import { Alert, Button, Form } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { validateChangePasswordValues } from "../utils/validators";

const initialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm({
  onSubmit,
  notice,
  submitError,
  isSubmitting,
}) {
  const form = useForm(initialValues, validateChangePasswordValues);

  return (
    <Form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      {notice && (
        <Alert variant="success" className="py-2 small">
          {notice}
        </Alert>
      )}
      {submitError && (
        <Alert variant="danger" className="py-2 small">
          {submitError}
        </Alert>
      )}

      <FormField
        label="Mật khẩu hiện tại"
        name="currentPassword"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={form.values.currentPassword}
        error={form.errors.currentPassword}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />

      <FormField
        label="Mật khẩu mới"
        name="newPassword"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Tối thiểu 8 ký tự, gồm cả chữ và số."
        value={form.values.newPassword}
        error={form.errors.newPassword}
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

      <div className="mt-4 pt-2 border-top">
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
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </Button>
      </div>
    </Form>
  );
}
