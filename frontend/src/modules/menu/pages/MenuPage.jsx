import { Alert, Button, Col, Row } from "react-bootstrap";
import { MenuFilterBar } from "../components/MenuFilterBar";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

export function MenuPage() {
  const catalog = useProducts();
  return (
    <>
      <h1 className="h2">Thực đơn healthy</h1>
      <p className="text-muted mb-4">Chọn bữa ăn phù hợp với khẩu vị và mục tiêu dinh dưỡng của bạn.</p>
      <MenuFilterBar {...catalog} />
      <p className="small text-muted" role="status">Tìm thấy {catalog.filteredProducts.length} món ăn</p>
      {catalog.filteredProducts.length === 0 ? (
        <Alert variant="light" className="text-center py-5 border">
          <h2 className="h5">Không tìm thấy món phù hợp với bộ lọc</h2>
          <p>Thử đổi từ khóa, danh mục hoặc mức Calories tối đa.</p>
          <Button variant="outline-primary" onClick={catalog.resetFilters}>Xóa bộ lọc</Button>
        </Alert>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {catalog.filteredProducts.map((product) => <Col key={product.id}><ProductCard product={product} /></Col>)}
        </Row>
      )}
    </>
  );
}
