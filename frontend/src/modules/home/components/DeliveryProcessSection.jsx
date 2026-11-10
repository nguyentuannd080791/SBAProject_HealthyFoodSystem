// src/modules/home/components/DeliveryProcessSection.jsx
import { Row, Col, Card, Badge } from "react-bootstrap";

const STEPS = [
  {
    step: "01",
    title: "Chọn Combo Nguyên Liệu",
    detail: "Lựa chọn combo phù hợp với món ăn và khẩu phần của bạn.",
  },
  {
    step: "02",
    title: "Chuẩn Bị Nguyên Liệu",
    detail: "Nguyên liệu tươi sống được chia theo công thức của từng combo.",
  },
  {
    step: "03",
    title: "Đóng Gói Combo",
    detail:
      "Các nguyên liệu được đóng gói để khách tự chế biến sau khi nhận.",
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
          Quy Trình Giao Combo Nguyên Liệu tại Healthy Food System
        </h2>
        <p className="text-muted mb-0">
          Giao nguyên liệu tươi sống theo đúng combo bạn đã chọn
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
