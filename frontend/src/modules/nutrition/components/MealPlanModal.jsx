import { Alert, Button, Modal } from "react-bootstrap";
import { Link } from "react-router";
import { FlameIcon, SparklesIcon } from "../../../shared/components/Icons";

export function MealPlanModal({ show, onHide, results }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
          <SparklesIcon size={20} className="text-warning" />
          Lên thực đơn cá nhân hóa
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-2">
          <div
            className="d-inline-flex p-3 rounded-circle mb-3"
            style={{ background: "#ecfdf5", color: "#15803d" }}
          >
            <FlameIcon size={36} />
          </div>
          <h4 className="fw-bold mb-2">
            Mục tiêu {results?.targetCaloriesKcal?.toLocaleString()} kcal / ngày
          </h4>
          <p className="text-muted small mb-3">
            Hệ thống đã lưu cấu hình dinh dưỡng của bạn:{" "}
            <strong>{results?.macroBreakdown?.proteinG}g Protein</strong> ·{" "}
            <strong>{results?.macroBreakdown?.carbohydrateG}g Carbs</strong> ·{" "}
            <strong>{results?.macroBreakdown?.fatG}g Fat</strong>.
          </p>
          <Alert variant="info" className="text-start small">
            <strong>Sẵn sàng cho API lên thực đơn:</strong> Thuật toán tự động
            ghép món ăn phù hợp với chính xác lượng calo của từng bữa (Sáng{" "}
            {results?.mealBreakdown?.breakfastKcal} kcal, Trưa{" "}
            {results?.mealBreakdown?.lunchKcal} kcal, Tối{" "}
            {results?.mealBreakdown?.dinnerKcal} kcal) đang được kết nối và sẽ
            sớm ra mắt ở bước tiếp theo!
          </Alert>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Đóng
        </Button>
        <Button as={Link} to="/menu" variant="primary" onClick={onHide}>
          Khám phá thực đơn hiện tại
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
