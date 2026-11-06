import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Form } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { registerSchema } from "../validations/registerSchema";

const defaultValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm({ onSubmit, submitError, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: "onBlur",
  });

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
      {submitError && (
        <Alert variant="danger" className="py-2 small">
          {submitError}
        </Alert>
      )}

      <FormField
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <FormField
        label="Email"
        type="email"
        placeholder="name@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        label="Số điện thoại"
        type="tel"
        placeholder="0912345678"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <FormField
        label="Mật khẩu"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Tối thiểu 8 ký tự, bao gồm cả chữ và số."
        error={errors.password?.message}
        {...register("password")}
      />
      <FormField
        label="Nhập lại mật khẩu"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
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
        {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
      </Button>
    </Form>
  );
}
