import { useState } from "react";
import { Alert, Badge, Button, Card, Spinner } from "react-bootstrap";
import { HeartPulseIcon, PlusIcon } from "../../../shared/components/Icons";
import { useScreening } from "../hooks/useScreening";
import { ScreeningEditModal } from "./ScreeningEditModal";

export function ClinicalScreeningSection() {
  const {
    conditions,
    ingredients,
    userProfile,
    loading,
    saving,
    error,
    success,
    setError,
    setSuccess,
    saveProfile,
  } = useScreening();

  const [showModal, setShowModal] = useState(false);

  const activeConditions = userProfile?.conditions || [];
  const activeAllergies = userProfile?.allergicIngredients || [];

  function handleOpenModal() {
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleSaveModal(condIds, allergyIds) {
    const result = await saveProfile(condIds, allergyIds, "");
    if (result.success) {
      setShowModal(false);
    }
  }

  async function handleDeleteCondition(conditionId) {
    const nextConditions = activeConditions
      .map((c) => c.id)
      .filter((id) => id !== conditionId);
    const allergyIds = activeAllergies.map((i) => i.id);
    await saveProfile(nextConditions, allergyIds, "");
  }

  async function handleDeleteAllergy(ingredientId) {
    const conditionIds = activeConditions.map((c) => c.id);
    const nextAllergies = activeAllergies
      .map((i) => i.id)
      .filter((id) => id !== ingredientId);
    await saveProfile(conditionIds, nextAllergies, "");
  }

  async function handleClearAllAllergies() {
    const conditionIds = activeConditions.map((c) => c.id);
    await saveProfile(conditionIds, [], "");
  }

  const hasAnyScreening = activeConditions.length > 0 || activeAllergies.length > 0;

  return (
    <>
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
              <HeartPulseIcon size={22} />
            </div>
            <div>
              <h2 className="h5 mb-1 fw-bold text-dark">
                Hồ sơ sàng lọc sức khỏe & dị ứng
              </h2>
              <p className="text-muted small mb-0">
                Chỉ số bệnh lý và nguyên liệu dị ứng để hệ thống kiểm soát và cảnh báo món ăn an toàn.
              </p>
            </div>
          </div>

          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError("")}
              className="py-2 small mb-3"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setSuccess("")}
              className="py-2 small mb-3"
            >
              {success}
            </Alert>
          )}

          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" size="sm" role="status" variant="success">
                <span className="visually-hidden">Đang tải...</span>
              </Spinner>
            </div>
          )}

          {!loading && !hasAnyScreening && (
            <div className="text-center py-5 px-3 border rounded-4 bg-light-subtle">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#f0fdf4",
                  color: "var(--hf-primary)",
                }}
              >
                <HeartPulseIcon size={28} />
              </div>
              <h3 className="h6 fw-bold text-dark mb-1">
                Chưa có thiết lập sàng lọc lâm sàng
              </h3>
              <p
                className="text-muted small mb-3"
                style={{ maxWidth: 460, margin: "0 auto" }}
              >
                Bạn chưa lưu thông tin bệnh lý nền hoặc nguyên liệu dị ứng. Thiết lập hồ sơ để hệ thống tự động loại trừ và cảnh báo món ăn không an toàn.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                onClick={handleOpenModal}
                style={{
                  backgroundColor: "var(--hf-primary)",
                  borderColor: "var(--hf-primary)",
                }}
              >
                <PlusIcon size={16} />
                <span>Thiết lập hồ sơ ngay</span>
              </Button>
            </div>
          )}

          {!loading && hasAnyScreening && (
            <div>
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="h6 fw-bold text-dark mb-0">
                    Bệnh lý nền đang áp dụng ({activeConditions.length})
                  </h3>
                </div>

                {activeConditions.length === 0 ? (
                  <p className="text-muted small mb-0 fst-italic">
                    Không có bệnh lý nền nào được chọn.
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {activeConditions.map((cond) => (
                      <div
                        key={cond.id}
                        className="p-3 rounded-3 border bg-white shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
                      >
                        <div style={{ flex: 1 }}>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <strong className="text-dark">
                              {cond.vietnameseName}
                            </strong>
                            <Badge bg="danger-subtle" className="text-danger border border-danger-subtle small fw-normal">
                              Đang cảnh báo
                            </Badge>
                          </div>

                          <p className="text-muted small mb-2" style={{ fontSize: "0.85rem" }}>
                            {cond.description}
                          </p>

                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {cond.maxSodiumMg && (
                              <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.75rem" }}>
                                Natri ≤ {cond.maxSodiumMg}mg
                              </Badge>
                            )}
                            {cond.maxSugarG && (
                              <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.75rem" }}>
                                Đường ≤ {cond.maxSugarG}g
                              </Badge>
                            )}
                            {cond.maxFatG && (
                              <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.75rem" }}>
                                Chất béo ≤ {cond.maxFatG}g
                              </Badge>
                            )}
                            {cond.maxProteinG && (
                              <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.75rem" }}>
                                Protein ≤ {cond.maxProteinG}g
                              </Badge>
                            )}
                            {cond.maxCarbohydrateG && (
                              <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.75rem" }}>
                                Carbs ≤ {cond.maxCarbohydrateG}g
                              </Badge>
                            )}
                            {cond.maxCaloriesKcal && (
                              <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.75rem" }}>
                                Calo ≤ {cond.maxCaloriesKcal}kcal
                              </Badge>
                            )}
                            {cond.maxPotassiumMg && (
                              <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.75rem" }}>
                                Kali ≤ {cond.maxPotassiumMg}mg
                              </Badge>
                            )}
                          </div>

                          {cond.forbiddenKeywords && cond.forbiddenKeywords.length > 0 && (
                            <div className="text-danger small" style={{ fontSize: "0.82rem" }}>
                              <strong>Nguyên liệu cấm: </strong>
                              {cond.forbiddenKeywords.join(", ")}
                            </div>
                          )}
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            disabled={saving}
                            onClick={() => handleDeleteCondition(cond.id)}
                            className="px-3 rounded-pill"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <hr className="my-4" />

              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="h6 fw-bold text-dark mb-0">
                    Nguyên liệu dị ứng & kiêng ({activeAllergies.length})
                  </h3>
                  {activeAllergies.length > 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      disabled={saving}
                      className="text-danger p-0 small text-decoration-none"
                      onClick={handleClearAllAllergies}
                    >
                      Xóa tất cả dị ứng
                    </Button>
                  )}
                </div>

                {activeAllergies.length === 0 ? (
                  <p className="text-muted small mb-0 fst-italic">
                    Chưa chọn nguyên liệu dị ứng nào.
                  </p>
                ) : (
                  <div className="d-flex flex-wrap gap-2 p-3 bg-light-subtle rounded-3 border">
                    {activeAllergies.map((ing) => (
                      <span
                        key={ing.id}
                        className="badge bg-white text-danger border border-danger-subtle d-inline-flex align-items-center gap-2 py-2 px-3 small rounded-pill shadow-xs"
                      >
                        <span className="fw-semibold">{ing.name}</span>
                        <button
                          type="button"
                          className="btn-close btn-close-sm"
                          aria-label={`Xóa dị ứng ${ing.name}`}
                          disabled={saving}
                          onClick={() => handleDeleteAllergy(ing.id)}
                          style={{ fontSize: "0.65rem" }}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <Button
                  variant="outline-success"
                  size="sm"
                  className="fw-semibold px-4 py-2 rounded-pill"
                  onClick={handleOpenModal}
                >
                  Điều chỉnh hồ sơ
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <ScreeningEditModal
        show={showModal}
        onHide={handleCloseModal}
        conditions={conditions}
        ingredients={ingredients}
        activeConditions={activeConditions}
        activeAllergies={activeAllergies}
        onSave={handleSaveModal}
        saving={saving}
      />
    </>
  );
}
