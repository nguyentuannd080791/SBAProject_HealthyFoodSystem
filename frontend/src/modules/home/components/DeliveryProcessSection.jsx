// src/modules/home/components/DeliveryProcessSection.jsx
import { Row, Col, Card, Badge } from "react-bootstrap";

const STEPS = [
  {
    step: "01",
    title: "Chọn Món hoặc Gói Ăn",
    detail: "Lựa chọn khẩu phần phù hợp với chỉ số Calo và mục tiêu của bạn.",
  },
  {
    step: "02",
    title: "Chế Biến Tươi Mỗi Sáng",
    detail: "Đầu bếp chế biến từ nguyên liệu tươi trong ngày, hạn chế dầu mỡ.",
  },
  {
    step: "03",
    title: "Đóng Gói Khay Sinh Học",
    detail:
      "Hộp bã mía an toàn sức khỏe, dán nhãn đầy đủ thông tin Kcal & Macro.",
  },
  {
    step: "04",
    title: "Giao Tận Tay Đúng Giờ",
    detail:
      "Shipper giao tận văn phòng hoặc nhà riêng theo 2 khung giờ Trưa & Tối.",
  },
];

export function DeliveryProcessSection() {
  return (
    <section className="mb-5 p-4 p-md-5 bg-light rounded-4 border">
      <div className="text-center mb-4">
        <h2 className="h4 fw-bold">
          Quy Trình Giao Đồ Ăn tại Healthy Food System
        </h2>
        <p className="text-muted mb-0">
          Đảm bảo độ tươi ngon và nhiệt độ món ăn khi đến tay bạn
        </p>
      </div>
      <Row className="g-4">
        {STEPS.map((item) => (
          <Col sm={6} lg={3} key={item.step}>
            <Card className="h-100 border-0 shadow-sm rounded-3">
              <Card.Body>
                <Badge
                  bg="success"
                  className="mb-3"
                >{`Bước ${item.step}`}</Badge>
                <Card.Title className="h6 fw-bold">{item.title}</Card.Title>
                <Card.Text className="small text-muted">
                  {item.detail}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
