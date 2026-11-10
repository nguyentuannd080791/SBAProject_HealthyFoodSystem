import { useState } from "react";
import { Alert, Badge, Button, Card, Spinner } from "react-bootstrap";
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
  const activeNote = userProfile?.note || "";

  function handleOpenModal() {
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleSaveModal(condIds, allergyIds, note) {
    const result = await saveProfile(condIds, allergyIds, note);
    if (result.success) {
      setShowModal(false);
    }
  }

  async function handleDeleteCondition(conditionId) {
    const nextConditions = activeConditions
      .map((c) => c.id)
      .filter((id) => id !== conditionId);
    const allergyIds = activeAllergies.map((i) => i.id);
    await saveProfile(nextConditions, allergyIds, activeNote);
  }

  async function handleDeleteAllergy(ingredientId) {
    const conditionIds = activeConditions.map((c) => c.id);
    const nextAllergies = activeAllergies
      .map((i) => i.id)
      .filter((id) => id !== ingredientId);
    await saveProfile(conditionIds, nextAllergies, activeNote);
  }

  async function handleClearAllAllergies() {
    const conditionIds = activeConditions.map((c) => c.id);
    await saveProfile(conditionIds, [], activeNote);
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-sm p-4 text-center">
        <div className="py-5">
          <Spinner animation="border" variant="success" className="mb-2" />
          <p className="text-muted small mb-0">
            Đang tải dữ liệu hồ sơ lâm sàng...
          </p>
        </div>
      </Card>
    );
  }

  const hasAnyScreening = activeConditions.length > 0 || activeAllergies.length > 0;

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div>
              <h2 className="h5 fw-bold mb-1">
                Hồ sơ Sàng lọc Sức khỏe & Dị ứng
              </h2>
              <p className="text-muted small mb-0">
                Các chỉ số lâm sàng và nguyên liệu kiêng kỵ để hệ thống tự động cảnh báo khi bạn chọn món.
              </p>
            </div>
            <Button
              variant="success"
              size="sm"
              className="fw-semibold px-3 py-2"
              onClick={handleOpenModal}
            >
              + Thêm mới / Cập nhật
            </Button>
          </div>

          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError("")}
              className="py-2 small"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setSuccess("")}
              className="py-2 small"
            >
              {success}
            </Alert>
          )}

          {!hasAnyScreening ? (
            <div className="p-4 rounded border bg-light text-center my-3">
              <h3 className="h6 fw-bold text-dark mb-2">
                Chưa có thiết lập sàng lọc lâm sàng
              </h3>
              <p className="text-muted small mb-3" style={{ maxWidth: 500, margin: "0 auto" }}>
                Bạn chưa lưu thông tin bệnh lý nền hoặc nguyên liệu dị ứng. Bấm nút dưới đây để thiết lập và giúp hệ thống lọc món ăn phù hợp với sức khỏe của bạn.
              </p>
              <Button
                variant="outline-success"
                size="sm"
                className="fw-semibold px-4"
                onClick={handleOpenModal}
              >
                Thiết lập hồ sơ sức khỏe
              </Button>
            </div>
          ) : (
            <div className="mt-3">
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
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
                        className="p-3 rounded border bg-white shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
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
                            className="px-3"
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
                <div className="d-flex align-items-center justify-content-between mb-2">
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
                  <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded border">
                    {activeAllergies.map((ing) => (
                      <span
                        key={ing.id}
                        className="badge bg-white text-danger border border-danger-subtle d-inline-flex align-items-center gap-2 py-2 px-3 small"
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

              {activeNote && (
                <>
                  <hr className="my-4" />
                  <div className="mb-3">
                    <h3 className="h6 fw-bold text-dark mb-1">
                      Ghi chú dặn dò thêm
                    </h3>
                    <p className="text-muted small mb-0 bg-light p-3 rounded border">
                      {activeNote}
                    </p>
                  </div>
                </>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="fw-semibold px-3"
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
        activeNote={activeNote}
        onSave={handleSaveModal}
        saving={saving}
      />
    </>
  );
}
