import { useEffect, useState } from "react";
import { Badge, Button, Form, Modal, Spinner } from "react-bootstrap";

export function ScreeningEditModal({
  show,
  onHide,
  conditions = [],
  ingredients = [],
  activeConditions = [],
  activeAllergies = [],
  activeNote = "",
  onSave,
  saving = false,
}) {
  const [modalConditions, setModalConditions] = useState([]);
  const [modalAllergies, setModalAllergies] = useState([]);
  const [modalNote, setModalNote] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [selectedCondToAdd, setSelectedCondToAdd] = useState("");

  useEffect(() => {
    if (show) {
      setModalConditions(activeConditions.map((c) => (typeof c === "object" ? c.id : c)));
      setModalAllergies(activeAllergies.map((i) => (typeof i === "object" ? i.id : i)));
      setModalNote(activeNote || "");
      setIngredientSearch("");
      setSelectedCondToAdd("");
    }
  }, [show, activeConditions, activeAllergies, activeNote]);

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
    await onSave(modalConditions, modalAllergies, modalNote);
  }

  const filteredIngredients = ingredients.filter((ing) =>
    (ing.name || "").toLowerCase().includes(ingredientSearch.toLowerCase().trim()),
  );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold mb-0">
          Thiết lập Sàng lọc Bệnh nền & Dị ứng
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Phần 1: Bệnh lý nền */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <h4 className="h6 fw-bold text-dark mb-0">
              Phần 1: Chọn bệnh lý nền ({modalConditions.length} đã chọn)
            </h4>
            <Badge bg="light" text="dark" className="border">
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
              className="form-select-sm"
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
              variant="success"
              size="sm"
              disabled={!selectedCondToAdd}
              onClick={() => {
                if (selectedCondToAdd) {
                  toggleCondition(Number(selectedCondToAdd));
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
                      onClick={() => toggleCondition(cond.id)}
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

        {/* Phần 2: Nguyên liệu dị ứng */}
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
                    onClick={() => toggleAllergy(ing.id)}
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

        {/* Phần 3: Ghi chú */}
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
        <Button variant="outline-secondary" size="sm" onClick={onHide} disabled={saving}>
          Hủy
        </Button>
        <Button
          variant="success"
          size="sm"
          onClick={handleSave}
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
  );
}

