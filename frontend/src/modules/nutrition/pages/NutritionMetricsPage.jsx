import { useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { HeartPulseIcon } from "../../../shared/components/Icons";
import { BodyMetricsForm } from "../components/BodyMetricsForm";
import { MealPlanModal } from "../components/MealPlanModal";
import { NutritionResultsView } from "../components/NutritionResultsView";
import { useBodyMetrics } from "../hooks/useBodyMetrics";
import "../styles/nutrition.css";

export function NutritionMetricsPage() {
  const { formState, status, results, calculate } = useBodyMetrics();
  const [showMealModal, setShowMealModal] = useState(false);

  return (
    <div className="nutrition-page">
      <div className="nutrition-hero">
        <span className="nutrition-hero-eyebrow">
          <HeartPulseIcon size={14} /> Chăm sóc vóc dáng & Sức khỏe
        </span>
        <h1>Đo chỉ số cơ thể & Nhu cầu Calo</h1>
        <p>
          Tính toán chính xác chỉ số khối cơ thể (BMI), năng lượng tiêu hao
          (TDEE) và lượng calo cần thiết để xây dựng bộ thực đơn dinh dưỡng cá
          nhân hóa dành riêng cho bạn.
        </p>
      </div>

      {status.error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => status.setError("")}
        >
          {status.error}
        </Alert>
      )}

      {status.successMsg && (
        <Alert
          variant="success"
          dismissible
          onClose={() => status.setSuccessMsg("")}
        >
          {status.successMsg}
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={5}>
          <BodyMetricsForm
            formState={formState}
            status={status}
            onSubmit={calculate}
          />
        </Col>

        <Col lg={7}>
          <NutritionResultsView
            results={results}
            onOpenMealModal={() => setShowMealModal(true)}
          />
        </Col>
      </Row>

      <MealPlanModal
        show={showMealModal}
        onHide={() => setShowMealModal(false)}
        results={results}
      />
    </div>
  );
}
