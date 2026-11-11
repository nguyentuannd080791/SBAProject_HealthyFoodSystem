import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import {
  ActivityIcon,
  CheckIcon,
  LockIcon,
} from "../../../shared/components/Icons";
import { ACTIVITY_OPTIONS, GOAL_OPTIONS } from "../hooks/useBodyMetrics";

export function BodyMetricsForm({ formState, status, onSubmit }) {
  const {
    gender,
    setGender,
    heightCm,
    setHeightCm,
    weightKg,
    setWeightKg,
    age,
    setAge,
    activityLevel,
    setActivityLevel,
    goal,
    setGoal,
    isProfileLocked,
    isHeightAgeLocked,
  } = formState;

  const isLocked = Boolean(isProfileLocked ?? isHeightAgeLocked);
  const { loading } = status;

  return (
    <Card className="nutrition-card">
      <div className="nutrition-card-header">
        <h2 className="nutrition-card-title">
          <ActivityIcon size={20} /> Nhập thông số cơ thể
        </h2>
        {isLocked && (
          <span
            className="nutrition-field-locked"
            title="Giới tính, chiều cao và tuổi được cố định theo hồ sơ của bạn"
          >
            <LockIcon size={12} /> Cố định hồ sơ
          </span>
        )}
      </div>

      <div className="nutrition-card-body">
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-secondary d-flex justify-content-between align-items-center">
              <span>Giới tính sinh học</span>
              {isLocked && <LockIcon size={12} className="text-muted" />}
            </Form.Label>
            <div className="nutrition-gender-group">
              <button
                type="button"
                className={`nutrition-gender-option ${
                  gender === "MALE" ? "active" : ""
                } ${isLocked ? "disabled" : ""}`}
                disabled={isLocked}
                onClick={() => !isLocked && setGender("MALE")}
              >
                Nam
              </button>
              <button
                type="button"
                className={`nutrition-gender-option ${
                  gender === "FEMALE" ? "active" : ""
                } ${isLocked ? "disabled" : ""}`}
                disabled={isLocked}
                onClick={() => !isLocked && setGender("FEMALE")}
              >
                Nữ
              </button>
            </div>
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col sm={6}>
              <Form.Group controlId="input-height">
                <Form.Label className="small fw-bold text-secondary d-flex justify-content-between align-items-center">
                  <span>Chiều cao (cm)</span>
                  {isLocked && <LockIcon size={12} className="text-muted" />}
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.5"
                  min="50"
                  max="250"
                  required
                  disabled={isLocked}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Ví dụ: 170"
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group controlId="input-age">
                <Form.Label className="small fw-bold text-secondary d-flex justify-content-between align-items-center">
                  <span>Tuổi</span>
                  {isLocked && <LockIcon size={12} className="text-muted" />}
                </Form.Label>
                <Form.Control
                  type="number"
                  min="10"
                  max="120"
                  required
                  disabled={isLocked}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ví dụ: 25"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="input-weight">
            <Form.Label className="small fw-bold text-secondary">
              Cân nặng hiện tại (kg)
            </Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              min="20"
              max="300"
              required
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="Ví dụ: 65.5"
            />
            <Form.Text className="text-muted">
              Bạn có thể cập nhật cân nặng thường xuyên để điều chỉnh thực đơn.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-secondary">
              Mức độ vận động hàng tuần
            </Form.Label>
            <Form.Select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              {ACTIVITY_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary mb-2">
              Mục tiêu vóc dáng của bạn
            </Form.Label>
            <div className="nutrition-goals-grid">
              {GOAL_OPTIONS.map((g) => (
                <div
                  key={g.code}
                  role="button"
                  tabIndex={0}
                  className={`nutrition-goal-card ${
                    goal === g.code ? "active" : ""
                  }`}
                  onClick={() => setGoal(g.code)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setGoal(g.code);
                    }
                  }}
                >
                  <div className="nutrition-goal-title">
                    <span>{g.label}</span>
                    {goal === g.code && <CheckIcon size={14} />}
                  </div>
                  <p className="nutrition-goal-desc">{g.desc}</p>
                </div>
              ))}
            </div>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-bold py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang tính toán...
              </>
            ) : (
              "Tính toán & Lưu chỉ số"
            )}
          </Button>
        </Form>
      </div>
    </Card>
  );
}
