import { Alert, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { BodyMetricsForm } from "../components/BodyMetricsForm";
import { NutritionResultsView } from "../components/NutritionResultsView";
import { useBodyMetrics } from "../hooks/useBodyMetrics";
import "../styles/nutrition.css";

const STORAGE_PREFIX = "healthy_food_meal_plan_";

export function NutritionMetricsPage() {
  const { formState, status, results, calculate } = useBodyMetrics();
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasSavedPlan = Boolean(
    user?.email &&
      typeof window !== "undefined" &&
      window.localStorage.getItem(`${STORAGE_PREFIX}${user.email}`)
  );

  async function handleGenerateMealPlan() {
    const calcRes = await calculate();
    if (calcRes?.error) return;
    navigate("/nutrition/plan", {
      state: { regenerate: true, results: calcRes?.data || results },
    });
  }

  return (
    <div className="nutrition-page">
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
            onGenerateMealPlan={handleGenerateMealPlan}
            hasSavedPlan={hasSavedPlan}
          />
        </Col>
      </Row>
    </div>
  );
}
