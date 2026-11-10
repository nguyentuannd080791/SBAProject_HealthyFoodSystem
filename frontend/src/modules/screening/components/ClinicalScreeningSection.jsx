import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useScreening } from "../hooks/useScreening";

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
  const [modalConditions, setModalConditions] = useState([]);
  const [modalAllergies, setModalAllergies] = useState([]);
  const [modalNote, setModalNote] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [selectedCondToAdd, setSelectedCondToAdd] = useState("");

  const activeConditions = userProfile?.conditions || [];
  const activeAllergies = userProfile?.allergicIngredients || [];
  const activeNote = userProfile?.note || "";

  function handleOpenModal() {
    setModalConditions(activeConditions.map((c) => c.id));
    setModalAllergies(activeAllergies.map((i) => i.id));
    setModalNote(activeNote);
    setIngredientSearch("");
    setSelectedCondToAdd("");
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function toggleModalCondition(id) {
    setModalConditions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleModalAllergy(id) {
    setModalAllergies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleSaveModal() {
    const result = await saveProfile(modalConditions, modalAllergies, modalNote);
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

  const filteredIngredients = ingredients.filter((ing) =>
    (ing.name || "").toLowerCase().includes(ingredientSearch.toLowerCase().trim())
  );

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
                          aria-label="Xóa"
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
                      Ghi chú thêm
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

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold mb-0">
            Thiết lập Sàng lọc Bệnh nền & Dị ứng
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h4 className="h6 fw-bold text-dark mb-0">
                Phần 1: Chọn bệnh lý nền ({modalConditions.length} đã chọn)
              </h4>
              <Badge bg="light" text="dark" className="border">
                15 bệnh phổ biến
              </Badge>
            </div>
            <p className="text-muted small mb-3">
              Chọn bệnh lý nền từ danh sách bên dưới để hệ thống tự động kiểm tra vi chất và cảnh báo khi bạn chọn món.
            </p>

            <div className="d-flex gap-2 mb-3">
              <Form.Select
                value={selectedCondToAdd}
                onChange={(e) => setSelectedCondToAdd(e.target.value)}
                className="form-select-sm"
              >
                <option value="">-- Chọn bệnh lý nền từ danh sách (15 bệnh phổ biến) --</option>
                {conditions
                  .filter((c) => !modalConditions.includes(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.vietnameseName} ({c.name})
                    </option>
                  ))}
              </Form.Select>
              <Button
                variant="success"
                size="sm"
                disabled={!selectedCondToAdd}
                onClick={() => {
                  if (selectedCondToAdd) {
                    toggleModalCondition(Number(selectedCondToAdd));
                    setSelectedCondToAdd("");
                  }
                }}
                className="text-nowrap fw-semibold px-3"
              >
                + Thêm bệnh
              </Button>
            </div>

            {modalConditions.length === 0 ? (
              <div className="p-3 bg-light rounded border text-muted small text-center">
                Chưa có bệnh lý nền nào được chọn. Chọn bệnh từ danh sách thả xuống trên và bấm "+ Thêm bệnh".
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {conditions
                  .filter((c) => modalConditions.includes(c.id))
                  .map((cond) => (
                    <div
                      key={cond.id}
                      className="p-3 rounded border bg-light d-flex justify-content-between align-items-start gap-2"
                    >
                      <div>
                        <strong className="text-dark d-block mb-1">
                          {cond.vietnameseName}
                        </strong>
                        <p className="text-muted small mb-2" style={{ fontSize: "0.82rem" }}>
                          {cond.description}
                        </p>
                        <div className="d-flex flex-wrap gap-1 mb-1">
                          {cond.maxSodiumMg && (
                            <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.72rem" }}>
                              Natri ≤ {cond.maxSodiumMg}mg
                            </Badge>
                          )}
                          {cond.maxSugarG && (
                            <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.72rem" }}>
                              Đường ≤ {cond.maxSugarG}g
                            </Badge>
                          )}
                          {cond.maxFatG && (
                            <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.72rem" }}>
                              Chất béo ≤ {cond.maxFatG}g
                            </Badge>
                          )}
                          {cond.maxProteinG && (
                            <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.72rem" }}>
                              Protein ≤ {cond.maxProteinG}g
                            </Badge>
                          )}
                          {cond.maxCarbohydrateG && (
                            <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.72rem" }}>
                              Carbs ≤ {cond.maxCarbohydrateG}g
                            </Badge>
                          )}
                          {cond.maxCaloriesKcal && (
                            <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.72rem" }}>
                              Calo ≤ {cond.maxCaloriesKcal}kcal
                            </Badge>
                          )}
                          {cond.maxPotassiumMg && (
                            <Badge bg="secondary" className="fw-normal" style={{ fontSize: "0.72rem" }}>
                              Kali ≤ {cond.maxPotassiumMg}mg
                            </Badge>
                          )}
                        </div>
                        {cond.forbiddenKeywords && cond.forbiddenKeywords.length > 0 && (
                          <div className="text-danger small" style={{ fontSize: "0.78rem" }}>
                            <strong>Cấm: </strong>
                            {cond.forbiddenKeywords.join(", ")}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => toggleModalCondition(cond.id)}
                        className="text-nowrap px-2 py-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Bỏ chọn
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <hr className="my-4" />

          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h4 className="h6 fw-bold text-dark mb-0">
                Phần 2: Chọn nguyên liệu dị ứng / kiêng ({modalAllergies.length} đã chọn)
              </h4>
              {modalAllergies.length > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger p-0 small text-decoration-none"
                  onClick={() => setModalAllergies([])}
                >
                  Bỏ chọn tất cả
                </Button>
              )}
            </div>
            <p className="text-muted small mb-2">
              Các món ăn chứa bất kỳ nguyên liệu nào được chọn dưới đây sẽ được gắn nhãn hạn chế.
            </p>

            <Form.Control
              type="text"
              size="sm"
              placeholder="Tìm nhanh nguyên liệu (ví dụ: tôm, cua, đậu phộng, trứng, sữa...)"
              value={ingredientSearch}
              onChange={(e) => setIngredientSearch(e.target.value)}
              className="mb-3"
            />

            <div
              className="p-3 bg-light rounded border d-flex flex-wrap gap-2"
              style={{ maxHeight: 220, overflowY: "auto" }}
            >
              {filteredIngredients.length === 0 ? (
                <span className="text-muted small">
                  Không tìm thấy nguyên liệu phù hợp
                </span>
              ) : (
                filteredIngredients.map((ing) => {
                  const isSelected = modalAllergies.includes(ing.id);
                  return (
                    <button
                      key={ing.id}
                      type="button"
                      onClick={() => toggleModalAllergy(ing.id)}
                      className={`btn btn-sm ${
                        isSelected
                          ? "btn-danger shadow-sm fw-semibold"
                          : "btn-outline-secondary bg-white text-dark"
                      }`}
                      style={{ fontSize: "0.82rem" }}
                    >
                      {isSelected ? "[x] " : ""}
                      {ing.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <hr className="my-4" />

          <div>
            <Form.Label className="h6 fw-bold text-dark mb-1">
              Phần 3: Ghi chú dặn dò thêm
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Ví dụ: Bác sĩ khuyên giảm muối, dị ứng nặng với hải sản..."
              value={modalNote}
              onChange={(e) => setModalNote(e.target.value)}
              className="small"
            />
          </div>
        </Modal.Body>

        <Modal.Footer className="border-top py-2 px-4">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleCloseModal}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={handleSaveModal}
            disabled={saving}
            className="fw-semibold px-4"
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Lưu hồ sơ sàng lọc</span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
