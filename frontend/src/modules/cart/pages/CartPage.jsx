import { useRef, useState } from "react";
import { Alert, Button, Card, Col, Image, Row, Table } from "react-bootstrap";
import { Link } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { CartIcon } from "../../../shared/components/Icons";
import { QuantityControl } from "../../../shared/components/QuantityControl";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { useCart } from "../hooks/useCart";
import { OrderPageHeader } from "../../orders/components/OrderPageHeader";
import "../../orders/styles/orders.css";

export function CartPage() {
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart, totalItems,
    totalPrice, totalCalories, storageError, cartError, pendingGuestItems,
    retryGuestCart, isCartLoading } = useCart();
  const pendingRef = useRef(new Set());
  const [pendingIds, setPendingIds] = useState(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearPending, setClearPending] = useState(false);

  async function runItemAction(itemId, action) {
    if (clearPending || pendingRef.current.has(itemId)) return;
    pendingRef.current.add(itemId);
    setPendingIds(new Set(pendingRef.current));
    try {
      await action();
    } finally {
      pendingRef.current.delete(itemId);
      setPendingIds(new Set(pendingRef.current));
    }
  }

  async function handleClearCart() {
    if (clearPending || pendingRef.current.size > 0) return;
    setClearPending(true);
    try {
      await clearCart();
    } finally {
      setClearPending(false);
      setShowClearConfirm(false);
    }
  }

  return (
    <div className="orders-page cart-page">
      <Link to="/menu" className="order-back">← Quay lại thực đơn</Link>
      <OrderPageHeader eyebrow="BỮA ĂN CỦA BẠN" title="Giỏ hàng"
        description="Một bữa ăn ngon bắt đầu từ những lựa chọn lành mạnh.">
        <span className="order-count-pill">{totalItems} món đã chọn</span>
      </OrderPageHeader>
      {storageError && <Alert variant="warning">{storageError}</Alert>}
      {cartError && <Alert variant="danger">{cartError}</Alert>}
      {user && pendingGuestItems > 0 && !isCartLoading && (
        <Alert variant="warning">
          {pendingGuestItems} món trong giỏ tạm chưa được chuyển vào tài khoản. Hãy chỉnh số lượng nếu cần, rồi{" "}
          <Button variant="outline-warning" size="sm" onClick={retryGuestCart}>Thử chuyển lại</Button>
        </Alert>
      )}
      {items.length === 0 ? (
        <Card body className="text-center py-5 border-0 shadow-sm">
          <div className="mb-3 text-secondary" aria-hidden="true">
            <CartIcon size={56} />
          </div>
          <h2 className="h4">Giỏ hàng đang trống</h2>
          <p className="text-muted">Chọn món ăn yêu thích để bắt đầu bữa ăn của bạn.</p>
        </Card>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <Card className="cart-items-panel">
              <Table responsive hover className="align-middle mb-0">
                <caption className="visually-hidden">Các món trong giỏ hàng</caption>
                <thead><tr>
                  <th scope="col">Món ăn</th><th scope="col">Đơn giá</th>
                  <th scope="col">Số lượng</th><th scope="col">Thành tiền</th><th scope="col">Thao tác</th>
                </tr></thead>
                <tbody>{items.map((item) => (
                  <tr key={item.cartItemId}>
                    <td><div className="d-flex align-items-center gap-3">
                      <Image src={item.image} alt={item.name} rounded width={72} height={64} style={{ objectFit: "cover" }} />
                      <Link to={`/products/${item.id}`} className="fw-semibold">{item.name}</Link>
                      {user && item.pendingGuest && <span className="small text-warning">Chưa chuyển vào tài khoản</span>}
                    </div></td>
                    <td className="text-nowrap">{formatCurrency(item.price)}</td>
                    <td><QuantityControl quantity={item.quantity} min={1} name={item.name}
                      disabled={clearPending || isCartLoading || pendingIds.has(item.cartItemId)}
                      onChange={(quantity) => runItemAction(item.cartItemId,
                        () => updateQuantity(item.cartItemId, quantity))} /></td>
                    <td className="text-nowrap fw-semibold">{formatCurrency(item.price * item.quantity)}</td>
                    <td><Button variant="outline-danger" size="sm" aria-label={`Xóa ${item.name}`}
                      disabled={clearPending || isCartLoading || pendingIds.has(item.cartItemId)}
                      onClick={() => runItemAction(item.cartItemId,
                        () => removeFromCart(item.cartItemId))}>Xóa</Button></td>
                  </tr>
                ))}</tbody>
              </Table>
            </Card>
            <div className="d-flex flex-wrap justify-content-end gap-2 mt-3">
              <Button variant="outline-danger" onClick={() => setShowClearConfirm(true)}
                disabled={clearPending || isCartLoading || pendingIds.size > 0}>Làm rỗng giỏ hàng</Button>
            </div>
          </Col>
          <Col lg={4}>
            <Card body className="order-panel cart-summary-panel">
              <div className="order-eyebrow mb-2">KIỂM TRA LẦN CUỐI</div>
              <h2 className="h4 mb-4">Tóm tắt đơn hàng</h2>
              <div className="d-flex justify-content-between mb-3"><span>Tổng số món</span><strong>{totalItems}</strong></div>
              <div className="d-flex justify-content-between mb-3"><span>Tổng tiền</span><strong>{formatCurrency(totalPrice)}</strong></div>
              <div className="d-flex justify-content-between gap-2 mb-3"><span>Tổng Calories dự tính</span><strong className="text-success text-nowrap">{totalCalories.toLocaleString("vi-VN")} kcal</strong></div>
              <p className="small text-muted">Dinh dưỡng được ước tính theo khẩu phần. Giá chưa bao gồm phí giao hàng.</p>
              {user && pendingGuestItems > 0 ? (
                <Button className="w-100" onClick={retryGuestCart}
                  disabled={isCartLoading || clearPending || pendingIds.size > 0}>Chuyển giỏ tạm để thanh toán</Button>
              ) : (
                <Button as={Link} to={user ? "/checkout" : "/login"}
                  state={user ? undefined : { from: "/checkout", notice: "Vui lòng đăng nhập để thanh toán đơn hàng." }}
                  className="w-100" disabled={isCartLoading || clearPending || pendingIds.size > 0}>
                  {isCartLoading ? "Đang chuẩn bị giỏ hàng..." : user ? "Tiến hành thanh toán" : "Đăng nhập để thanh toán"}
                </Button>
              )}
            </Card>
          </Col>
        </Row>
      )}
      <ConfirmDialog show={showClearConfirm} title="Làm rỗng giỏ hàng?"
        message="Tất cả món ăn trong giỏ sẽ bị xóa. Bạn có thể thêm lại từ thực đơn."
        confirmLabel={clearPending ? "Đang xóa…" : "Làm rỗng giỏ hàng"}
        isBusy={clearPending} onConfirm={handleClearCart}
        onCancel={() => { if (!clearPending) setShowClearConfirm(false); }} />
    </div>
    
  );
}
