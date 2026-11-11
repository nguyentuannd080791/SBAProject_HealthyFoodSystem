import { useEffect, useState } from "react";
import { Badge, Button, Form, Modal, Spinner } from "react-bootstrap";
import { HeartPulseIcon } from "../../../shared/components/Icons";

export function ScreeningEditModal({
  show,
  onHide,
  conditions = [],
  ingredients = [],
  activeConditions = [],
  activeAllergies = [],
  onSave,
  saving = false,
}) {
  const [modalConditions, setModalConditions] = useState([]);
  const [modalAllergies, setModalAllergies] = useState([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [selectedCondToAdd, setSelectedCondToAdd] = useState("");

  useEffect(() => {
    if (show) {
      setModalConditions(activeConditions.map((c) => (typeof c === "object" ? c.id : c)));
      setModalAllergies(activeAllergies.map((i) => (typeof i === "object" ? i.id : i)));
      setIngredientSearch("");
      setSelectedCondToAdd("");
    }
  }, [show, activeConditions, activeAllergies]);

  function toggleCondition(id) {
    setModalConditions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function toggleAllergy(id) {
    setModalAllergies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  async function handleSave() {
    await onSave(modalConditions, modalAllergies);
  }

  const filteredIngredients = ingredients.filter((ing) =>
    (ing.name || "").toLowerCase().includes(ingredientSearch.toLowerCase().trim()),
  );

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      scrollable
      backdrop="static"
    >
      <Modal.Header closeButton className="border-bottom pb-3">
        <Modal.Title className="h6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <HeartPulseIcon size={20} className="text-success" />
          <span>Thiết lập sàng lọc bệnh nền & dị ứng</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <h3 className="h6 fw-bold text-dark mb-0">
              Bệnh lý nền ({modalConditions.length} đã chọn)
            </h3>
            <Badge bg="light" text="dark" className="border fw-normal">
              {conditions.length} bệnh trong danh mục
            </Badge>
          </div>
          <p className="text-muted small mb-3">
            Chọn bệnh lý nền từ danh sách bên dưới để hệ thống tự động kiểm tra vi chất và cảnh báo khi bạn chọn món.
          </p>

          <div className="d-flex gap-2 mb-3">
            <Form.Select
              value={selectedCondToAdd}
              onChange={(e) => setSelectedCondToAdd(e.target.value)}
              size="sm"
            >
              <option value="">-- Chọn bệnh lý nền từ danh sách --</option>
              {conditions
                .filter((c) => !modalConditions.includes(c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.vietnameseName} ({c.name})
                  </option>
                ))}
            </Form.Select>
            <Button
              variant="primary"
              size="sm"
              disabled={!selectedCondToAdd}
              onClick={() => {
                if (selectedCondToAdd) {
                  toggleCondition(Number(selectedCondToAdd));
                  setSelectedCondToAdd("");
                }
              }}
              className="text-nowrap fw-semibold px-3 rounded-pill"
              style={{
                backgroundColor: "var(--hf-primary)",
                borderColor: "var(--hf-primary)",
              }}
            >
              + Thêm bệnh
            </Button>
          </div>

          {modalConditions.length === 0 ? (
            <div className="p-3 bg-light-subtle rounded-3 border text-muted small text-center">
              Chưa có bệnh lý nền nào được chọn. Chọn bệnh từ danh sách thả xuống trên và bấm "+ Thêm bệnh".
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {conditions
                .filter((c) => modalConditions.includes(c.id))
                .map((cond) => (
                  <div
                    key={cond.id}
                    className="p-3 rounded-3 border bg-light-subtle d-flex justify-content-between align-items-start gap-3"
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
                      onClick={() => toggleCondition(cond.id)}
                      className="text-nowrap px-3 py-1 rounded-pill"
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

        <div>
          <div className="d-flex align-items-center justify-content-between mb-1">
            <h3 className="h6 fw-bold text-dark mb-0">
              Nguyên liệu dị ứng & kiêng kỵ ({modalAllergies.length} đã chọn)
            </h3>
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
            className="p-3 bg-light-subtle rounded-3 border d-flex flex-wrap gap-2"
            style={{ maxHeight: 240, overflowY: "auto" }}
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
                    onClick={() => toggleAllergy(ing.id)}
                    className={`btn btn-sm rounded-pill ${
                      isSelected
                        ? "btn-danger shadow-xs fw-semibold"
                        : "btn-outline-secondary bg-white text-dark"
                    }`}
                    style={{ fontSize: "0.82rem" }}
                  >
                    {isSelected ? "✕ " : ""}
                    {ing.name}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top py-3 px-4">
        <Button
          type="button"
          variant="outline-secondary"
          className="px-4 rounded-pill"
          onClick={onHide}
          disabled={saving}
        >
          Hủy bỏ
        </Button>
        <Button
          type="button"
          variant="primary"
          className="px-4 fw-semibold rounded-pill d-inline-flex align-items-center gap-2"
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: "var(--hf-primary)",
            borderColor: "var(--hf-primary)",
          }}
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <span>Lưu hồ sơ sàng lọc</span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
