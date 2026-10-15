import { useSearchParams } from "react-router";
import { ChangePasswordSection } from "../../auth/components/ChangePasswordSection";
import { AddressSection } from "../components/AddressSection";
import { PersonalInfoSection } from "../components/PersonalInfoSection";
import { ProfileSidebar } from "../components/ProfileSidebar";

const VALID_TABS = ["profile", "address", "password"];

export function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const activeTab = VALID_TABS.includes(currentTab) ? currentTab : "profile";

  function handleSelectTab(key) {
    setSearchParams({ tab: key });
  }

  return (
    <div className="mx-auto" style={{ maxWidth: 1040 }}>
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">Cài đặt tài khoản</h1>
        <p className="text-muted small mb-0">
          Quản lý thông tin cá nhân, sổ địa chỉ và bảo mật tài khoản của bạn.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-md-5 col-lg-4">
          <ProfileSidebar activeTab={activeTab} onSelectTab={handleSelectTab} />
        </div>

        <div className="col-12 col-md-7 col-lg-8">
          <div className="profile-content-area">
            {activeTab === "profile" && <PersonalInfoSection />}
            {activeTab === "address" && <AddressSection />}
            {activeTab === "password" && <ChangePasswordSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
