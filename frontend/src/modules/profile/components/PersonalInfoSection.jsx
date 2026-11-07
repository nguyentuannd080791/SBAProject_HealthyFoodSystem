import { useEffect, useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { UserIcon } from "../../../shared/components/Icons";
import { profileApi } from "../api/profileApi";
import { ProfileForm } from "./ProfileForm";

const savedNotice = "Đã lưu thông tin cá nhân thành công.";

export function PersonalInfoSection() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    profileApi.get().then((result) => {
      if (result.error) setLoadError(result.error);
      else setProfile(result.data);
    });
  }, []);

  async function handleSubmit(values) {
    setNotice("");
    setSubmitError("");
    setIsSubmitting(true);
    const result = await profileApi.update(values);
    setIsSubmitting(false);

    if (result.error) return setSubmitError(result.error);

    setProfile(result.data);
    updateUser({ fullName: result.data.fullName });
    setNotice(savedNotice);
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
            <UserIcon size={22} />
          </div>
          <div>
            <h2 className="h5 mb-1 fw-bold text-dark">Thông tin cá nhân</h2>
            <p className="text-muted small mb-0">
              Quản lý họ tên, số điện thoại và thông tin tài khoản của bạn.
            </p>
          </div>
        </div>

        {notice && (
          <Alert variant="success" className="py-2 small mb-3">
            {notice}
          </Alert>
        )}
        {loadError && (
          <Alert variant="danger" className="py-2 small mb-3">
            {loadError}
          </Alert>
        )}

        {!profile && !loadError && (
          <div className="text-center py-5">
            <Spinner animation="border" size="sm" role="status" variant="success">
              <span className="visually-hidden">Đang tải...</span>
            </Spinner>
          </div>
        )}

        {profile && (
          <ProfileForm
            key={profile.fullName + (profile.phone || "")}
            profile={profile}
            onSubmit={handleSubmit}
            submitError={submitError}
            isSubmitting={isSubmitting}
          />
        )}
      </Card.Body>
    </Card>
  );
}
