// src/modules/home/components/HomeFooter.jsx
import { Row, Col } from "react-bootstrap";

export function HomeFooter() {
  return (
    <footer className="pt-4 mt-5 border-top text-muted small">
      <Row className="g-4 pb-4">
        <Col md={5}>
          <h3 className="h6 fw-bold text-dark">Healthy Food System</h3>
          <p className="mb-1">
            Hệ thống chuyên cung cấp bữa ăn dinh dưỡng kiểm soát Calo và giao
            hàng tận nơi.
          </p>
        </Col>
        <Col md={4}>
          <h3 className="h6 fw-bold text-dark">Khung Giờ Giao Hàng</h3>
          <p className="mb-1">Ca Trưa: 10:30 – 12:00 (Đặt trước 09:30)</p>
          <p className="mb-0">Ca Tối: 17:00 – 19:00 (Đặt trước 15:30)</p>
        </Col>
        <Col md={3}>
          <h3 className="h6 fw-bold text-dark">Liên Hệ</h3>
          <p className="mb-1">Hotline: 1900 6868</p>
          <p className="mb-0">Email: support@healthyfood.vn</p>
        </Col>
      </Row>
    </footer>
  );
}
