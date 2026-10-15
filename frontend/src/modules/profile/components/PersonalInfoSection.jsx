import { useEffect, useState } from "react";
import { Alert, Button, Card, Spinner } from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { UserIcon } from "../../../shared/components/Icons";
import { profileApi } from "../api/profileApi";
import { ProfileForm } from "./ProfileForm";
import { ProfileSummary } from "./ProfileSummary";

const savedNotice = "Đã lưu thông tin cá nhân.";

export function PersonalInfoSection() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    profileApi.get().then((result) => {
      if (result.error) setLoadError(result.error);
      else setProfile(result.data);
    });
  }, []);

  function startEditing() {
    setNotice("");
    setSubmitError("");
    setIsEditing(true);
  }

  async function handleSubmit(values) {
    setSubmitError("");
    setIsSubmitting(true);
    const result = await profileApi.update(values);
    setIsSubmitting(false);
    if (result.error) return setSubmitError(result.error);
    setProfile(result.data);
    updateUser({ fullName: result.data.fullName });
    setIsEditing(false);
    setNotice(savedNotice);
  }

  return (
    <Card body className="border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
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
            <h2 className="h5 mb-1 fw-bold">Thông tin cá nhân</h2>
            <p className="text-muted small mb-0">
              Quản lý họ tên, số điện thoại và địa chỉ email liên hệ của bạn.
            </p>
          </div>
        </div>
        {profile && !isEditing && (
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-pill px-3"
            onClick={startEditing}
          >
            Chỉnh sửa
          </Button>
        )}
      </div>

      {notice && <Alert variant="success">{notice}</Alert>}
      {loadError && <Alert variant="danger">{loadError}</Alert>}
      {!profile && !loadError && (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
        </div>
      )}
      {profile && !isEditing && <ProfileSummary profile={profile} />}
      {profile && isEditing && (
        <ProfileForm
          profile={profile}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          submitError={submitError}
          isSubmitting={isSubmitting}
        />
      )}
    </Card>
  );
}
