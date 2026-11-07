import { useState } from "react";
import { Card } from "react-bootstrap";
import { LockIcon } from "../../../shared/components/Icons";
import { authApi } from "../api/authApi";
import { ChangePasswordForm } from "./ChangePasswordForm";

const changedNotice = "Đổi mật khẩu thành công. Các phiên đăng nhập cũ đã được đăng xuất an toàn.";

export function ChangePasswordSection() {
  const [formKey, setFormKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values) {
    setNotice("");
    setSubmitError("");
    setIsSubmitting(true);
    const result = await authApi.changePassword(
      values.currentPassword,
      values.newPassword,
    );
    setIsSubmitting(false);

    if (result.error) return setSubmitError(result.error);

    setNotice(changedNotice);
    setFormKey(formKey + 1);
  }

  return (
    <Card className="profile-content-card">
      <Card.Body className="p-4 p-sm-5">
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              backgroundColor: "#f0fdf4",
              color: "var(--hf-primary)",
            }}
          >
            <LockIcon size={22} />
          </div>
          <div>
            <h2 className="h5 mb-1 fw-bold text-dark">Đổi mật khẩu tài khoản</h2>
            <p className="text-muted small mb-0">
              Để bảo vệ an toàn cho tài khoản, vui lòng không chia sẻ mật khẩu của bạn với người khác.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 520 }}>
          <ChangePasswordForm
            key={formKey}
            onSubmit={handleSubmit}
            notice={notice}
            submitError={submitError}
            isSubmitting={isSubmitting}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
