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
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <FormField
        label="Họ và tên"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        label="Số điện thoại"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <FormField
        label="Mật khẩu"
        type="password"
        autoComplete="new-password"
        hint="Ít nhất 8 ký tự, gồm cả chữ và số."
        error={errors.password?.message}
        {...register("password")}
      />
      <FormField
        label="Nhập lại mật khẩu"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" className="w-100 mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
      </Button>
    </Form>
  );
}
