import { Alert, Button, Form } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { validateForgotPasswordValues } from "../utils/validators";

export function ForgotPasswordForm({ onSubmit, submitError, isSubmitting }) {
  const form = useForm({ email: "" }, validateForgotPasswordValues);

  function submitTrimmed(values) {
    onSubmit({ email: values.email.trim() });
  }

  return (
    <Form noValidate onSubmit={form.handleSubmit(submitTrimmed)}>
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
        hint="Chúng tôi sẽ gửi mã OTP gồm 6 chữ số tới email này."
        value={form.values.email}
        error={form.errors.email}
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
        {isSubmitting ? "Đang gửi mã..." : "Gửi mã xác thực"}
      </Button>
    </Form>
  );
}
