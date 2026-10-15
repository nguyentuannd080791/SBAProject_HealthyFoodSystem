// src/modules/home/components/ServiceHighlights.jsx
import { Row, Col, Card } from "react-bootstrap";

const HIGHLIGHTS = [
  {
    id: "fresh",
    title: "Nguyên liệu tươi mỗi ngày",
    description: "Rau củ hữu cơ và thịt tươi sạch được chế biến trong ngày.",
  },
  {
    id: "macro",
    title: "Minh bạch Calo & Dinh dưỡng",
    description: "Mỗi phần ăn đều được tính toán kỹ lưỡng chỉ số Kcal.",
  },
  {
    id: "delivery",
    title: "Giao hàng đúng giờ",
    description: "Đóng gói giữ nhiệt an toàn, giao tận tay đúng khung giờ ăn.",
  },
];

function HighlightCard({ item }) {
  return (
    <Col md={4} className="mb-3">
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold text-success">{item.title}</Card.Title>
          <Card.Text className="text-muted">{item.description}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

export function ServiceHighlights() {
  return (
    <section className="mb-5">
      <Row>
        {HIGHLIGHTS.map((item) => (
          <HighlightCard key={item.id} item={item} />
        ))}
      </Row>
    </section>
  );
}
