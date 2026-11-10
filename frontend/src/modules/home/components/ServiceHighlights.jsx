// src/modules/home/components/ServiceHighlights.jsx
import { Row, Col, Card } from "react-bootstrap";

const HIGHLIGHTS = [
  {
    id: "fresh",
    title: "Nguyên liệu tươi mỗi ngày",
    description: "Combo gồm nguyên liệu tươi sống được chia theo định lượng cho từng món.",
  },
  {
    id: "macro",
    title: "Minh bạch Calo & Dinh dưỡng",
    description: "Thông tin dinh dưỡng được công bố cho từng combo nguyên liệu.",
  },
  {
    id: "delivery",
    title: "Giao hàng đúng giờ",
    description: "Nguyên liệu được đóng gói và giao tận tay theo khung giờ đã chọn.",
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
