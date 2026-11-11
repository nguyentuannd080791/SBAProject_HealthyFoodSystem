import { useSearchParams } from "react-router";
import { Badge } from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { getRoleLabel, getUserInitials } from "../../../shared/utils/roleUtils";
import {
  HeartPulseIcon,
  LockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserIcon,
} from "../../../shared/components/Icons";
import { ChangePasswordSection } from "../../auth/components/ChangePasswordSection";
import { AddressSection } from "../components/AddressSection";
import { PersonalInfoSection } from "../components/PersonalInfoSection";
import { ClinicalScreeningSection } from "../../screening/components/ClinicalScreeningSection";

const PROFILE_GROUPS = [
  {
    title: "Tài khoản",
    items: [
      { key: "profile", label: "Thông tin cá nhân", icon: UserIcon },
      { key: "address", label: "Địa chỉ giao hàng", icon: MapPinIcon },
    ],
  },
  {
    title: "Sức khỏe & Dinh dưỡng",
    items: [
      { key: "clinical", label: "Sàng lọc sức khỏe & Dị ứng", icon: HeartPulseIcon },
    ],
  },
  {
    title: "Bảo mật",
    items: [
      { key: "password", label: "Đổi mật khẩu", icon: LockIcon },
    ],
  },
];

const ALL_TAB_KEYS = PROFILE_GROUPS.flatMap((g) => g.items.map((i) => i.key));

export function ProfilePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const activeTab = ALL_TAB_KEYS.includes(currentTab) ? currentTab : "profile";

  function handleSelectTab(key) {
    setSearchParams({ tab: key });
  }

  const initials = getUserInitials(user?.fullName);

  return (
    <div className="mx-auto" style={{ maxWidth: 1060 }}>
      <div className="profile-hero-card mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="profile-avatar-medium">{initials}</div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h1 className="h5 fw-bold text-dark mb-0">
                {user?.fullName || "Người dùng"}
              </h1>
              <Badge
                bg="success-subtle"
                className="text-success border border-success-subtle px-2 py-1 small fw-normal"
              >
                {getRoleLabel(user?.role)}
              </Badge>
            </div>
            <p className="text-muted small mb-0">{user?.email}</p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 text-muted small bg-white px-3 py-2 rounded-pill border">
          <ShieldCheckIcon size={16} className="text-success" />
          <span>Tài khoản chính thức</span>
        </div>
      </div>

      <div className="profile-layout-grid">
        <aside className="profile-sidebar" aria-label="Danh mục cài đặt">
          {PROFILE_GROUPS.map((group) => (
            <div key={group.title} className="profile-sidebar-group">
              <div className="profile-sidebar-heading">{group.title}</div>
              <div className="profile-sidebar-nav">
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      className={`profile-sidebar-item ${isActive ? "active" : ""}`}
                      onClick={() => handleSelectTab(tab.key)}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <main className="profile-content-body">
          {activeTab === "profile" && <PersonalInfoSection />}
          {activeTab === "clinical" && <ClinicalScreeningSection />}
          {activeTab === "address" && <AddressSection />}
          {activeTab === "password" && <ChangePasswordSection />}
        </main>
      </div>
    </div>
  );
}
