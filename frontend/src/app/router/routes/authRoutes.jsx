import { ForgotPasswordPage } from "../../../modules/auth/pages/ForgotPasswordPage";
import { LoginPage } from "../../../modules/auth/pages/LoginPage";
import { RegisterPage } from "../../../modules/auth/pages/RegisterPage";
import { ResetPasswordPage } from "../../../modules/auth/pages/ResetPasswordPage";

export const authRoutes = [
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "reset-password", element: <ResetPasswordPage /> },
];
