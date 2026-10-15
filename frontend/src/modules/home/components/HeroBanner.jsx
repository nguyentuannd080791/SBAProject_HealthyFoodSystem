// src/modules/home/components/HeroBanner.jsx
import { Row, Col, Button, Badge, Card } from "react-bootstrap";

const SYSTEM_STATS = [
  { label: "Nguyên liệu", value: "100% Tươi mới mỗi sáng" },
  { label: "Định lượng", value: "Chuẩn Kcal & Macro" },
  { label: "Giao hàng", value: "Đúng giờ 30 - 45 phút" },
];

export function HeroBanner({ onExploreMenu, onExplorePlans }) {
  return (
    <section className="p-4 p-md-5 mb-5 bg-success bg-opacity-10 rounded-4 border border-success border-opacity-25">
      <Row className="align-items-center g-4">
        <Col lg={7}>
          <Badge bg="success" className="mb-3 px-3 py-2 rounded-pill">
            Hệ thống Bếp Dinh Dưỡng & Giao Món Tận Nơi
          </Badge>
          <h1 className="display-5 fw-bold text-dark mb-3">
            Healthy Food System
          </h1>
          <p className="lead text-secondary mb-4">
            Giải pháp bữa ăn lành mạnh được thiết kế chuẩn xác theo chỉ số năng
            lượng (Calories & Macros). Chế biến tươi mới mỗi ngày, không chất
            bảo quản, giao tận cửa đúng khung giờ ăn của bạn.
          </p>
          <div className="d-flex flex-wrap gap-3 mb-4">
            <Button variant="success" size="lg" onClick={onExploreMenu}>
              Đặt món lẻ hôm nay
            </Button>
            <Button
              variant="outline-success"
              size="lg"
              onClick={onExplorePlans}
            >
              Xem gói ăn theo tuần
            </Button>
          </div>
          <Row className="g-3 pt-2">
            {SYSTEM_STATS.map((stat) => (
              <Col sm={4} key={stat.label}>
                <div className="bg-white p-3 rounded-3 shadow-sm border h-100">
                  <div className="small text-muted">{stat.label}</div>
                  <div className="fw-bold text-success">{stat.value}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
        <Col lg={5}>
          <Card className="border-0 shadow rounded-4 overflow-hidden">
            <Card.Img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
              alt="Healthy Food System Bowl"
              style={{ height: "360px", objectFit: "cover" }}
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
}
