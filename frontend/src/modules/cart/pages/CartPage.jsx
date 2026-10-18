import { Alert, Button, Card, Col, Image, Row, Table } from "react-bootstrap";
import { Link } from "react-router";
import { QuantityControl } from "../../../shared/components/QuantityControl";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { useCart } from "../hooks/useCart";

export function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems,
    totalPrice, totalCalories, storageError } = useCart();

  return (
    <>
      <h1 className="h2 mb-4">Giỏ hàng của bạn</h1>
      {storageError && <Alert variant="warning">{storageError}</Alert>}
      {items.length === 0 ? (
        <Card body className="text-center py-5 border-0 shadow-sm">
          <div className="display-4 mb-3" aria-hidden="true">🛒</div>
          <h2 className="h4">Giỏ hàng đang trống</h2>
          <p className="text-muted">Chọn món ăn yêu thích để bắt đầu bữa ăn của bạn.</p>
          <Button as={Link} to="/menu">Khám phá thực đơn</Button>
        </Card>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Table responsive hover className="align-middle mb-0">
                <caption className="visually-hidden">Các món trong giỏ hàng</caption>
                <thead><tr>
                  <th scope="col">Món ăn</th><th scope="col">Đơn giá</th>
                  <th scope="col">Số lượng</th><th scope="col">Thành tiền</th><th scope="col">Thao tác</th>
                </tr></thead>
                <tbody>{items.map((item) => (
                  <tr key={item.id}>
                    <td><div className="d-flex align-items-center gap-3">
                      <Image src={item.image} alt={item.name} rounded width={72} height={64} style={{ objectFit: "cover" }} />
                      <Link to={`/products/${item.id}`} className="fw-semibold">{item.name}</Link>
                    </div></td>
                    <td className="text-nowrap">{formatCurrency(item.price)}</td>
                    <td><QuantityControl quantity={item.quantity} min={0} name={item.name}
                      onChange={(quantity) => updateQuantity(item.id, quantity)} /></td>
                    <td className="text-nowrap fw-semibold">{formatCurrency(item.price * item.quantity)}</td>
                    <td><Button variant="outline-danger" size="sm" aria-label={`Xóa ${item.name}`}
                      onClick={() => removeFromCart(item.id)}>Xóa</Button></td>
                  </tr>
                ))}</tbody>
              </Table>
            </Card>
            <div className="d-flex flex-wrap justify-content-between gap-2 mt-3">
              <Button as={Link} to="/menu" variant="outline-primary">Tiếp tục chọn món</Button>
              <Button variant="outline-danger" onClick={clearCart}>Làm rỗng giỏ hàng</Button>
            </div>
          </Col>
          <Col lg={4}>
            <Card body className="border-0 shadow-sm">
              <h2 className="h4 mb-4">Tóm tắt đơn hàng</h2>
              <div className="d-flex justify-content-between mb-3"><span>Tổng số món</span><strong>{totalItems}</strong></div>
              <div className="d-flex justify-content-between mb-3"><span>Tổng tiền</span><strong>{formatCurrency(totalPrice)}</strong></div>
              <div className="d-flex justify-content-between gap-2 mb-3"><span>Tổng Calories dự tính</span><strong className="text-success text-nowrap">{totalCalories.toLocaleString("vi-VN")} kcal</strong></div>
              <p className="small text-muted">Dinh dưỡng được ước tính theo khẩu phần. Giá chưa bao gồm phí giao hàng.</p>
              <Button as={Link} to="/checkout" className="w-100">Tiến hành thanh toán</Button>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
