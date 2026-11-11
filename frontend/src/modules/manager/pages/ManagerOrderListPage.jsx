import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import {
  formatOrderDate,
  orderStatuses,
} from "../../orders/utils/orderFormatting";
import { managerOrderApi } from "../api/managerOrderApi";

export function ManagerOrderListPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const method = params.get("method") ?? "";
  const status = params.get("status") ?? "";
  const paymentStatus = params.get("paymentStatus") ?? "";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const page = Math.max(0, Number.parseInt(params.get("page") ?? "0", 10) || 0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    managerOrderApi
      .list({
        search,
        method,
        status,
        paymentStatus,
        from: from || undefined,
        to: to || undefined,
        page,
        size: 20,
      })
      .then((response) => {
        if (!active) return;
        setResult(response.data ?? null);
        setError(response.error ?? "");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [search, method, status, paymentStatus, from, to, page, reload]);

  function applyFilters(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = {};
    for (const [key, value] of data)
      if (String(value).trim()) next[key] = String(value).trim();
    if (next.from && next.to && next.from > next.to) {
      setError("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
      return;
    }
    setParams(next);
  }

  function changePage(nextPage) {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setParams(next);
  }

  return (
    <div className="manager-orders-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <div className="manager-section-label">VẬN HÀNH CỬA HÀNG</div>
          <h2 className="h4 mb-1">Quản lý đơn hàng</h2>
          <p className="text-secondary mb-0">
            Theo dõi đơn hàng, thông tin giao nhận và trạng thái thanh toán.
          </p>
        </div>
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
          <Button
            variant="outline-primary"
            disabled={loading}
            onClick={() => setReload((value) => value + 1)}
          >
            Làm mới
          </Button>
        </div>
      </div>
      <Card body className="manager-order-filters mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h6 mb-0">Tìm kiếm & bộ lọc</h3>
          <span className="small text-secondary">Lọc nhanh đơn bạn cần</span>
        </div>
        <Form
          key={`${search}|${method}|${status}|${paymentStatus}|${from}|${to}`}
          onSubmit={applyFilters}
        >
          <Row className="g-3 align-items-end">
            <Col lg={4}>
              <Form.Label htmlFor="order-search">Tìm đơn hàng</Form.Label>
              <Form.Control
                id="order-search"
                name="search"
                maxLength={150}
                defaultValue={search}
                placeholder="Tên khách, mã đơn hoặc mã thanh toán"
              />
            </Col>
            <Col lg={2} sm={6}>
              <Form.Label htmlFor="order-method">Thanh toán</Form.Label>
              <Form.Select
                id="order-method"
                name="method"
                defaultValue={method}
              >
                <option value="">Tất cả</option>
                <option value="sepay">SePay</option>
                <option value="cash">Tiền mặt</option>
              </Form.Select>
            </Col>
            <Col lg={2} sm={6}>
              <Form.Label htmlFor="order-from">Từ ngày</Form.Label>
              <Form.Control
                id="order-from"
                type="date"
                name="from"
                defaultValue={from}
              />
            </Col>
            <Col lg={2} sm={6}>
              <Form.Label htmlFor="order-to">Đến ngày</Form.Label>
              <Form.Control
                id="order-to"
                type="date"
                name="to"
                defaultValue={to}
              />
            </Col>
            <Col lg={2} sm={6}>
              <Button type="submit" className="w-100">
                Áp dụng
              </Button>
            </Col>
          </Row>
          <Row className="g-3 mt-1">
            <Col md={6}>
              <Form.Label htmlFor="order-status">
                Trạng thái đơn hàng
              </Form.Label>
              <Form.Select
                id="order-status"
                name="status"
                defaultValue={status}
              >
                <option value="">Tất cả trạng thái đơn</option>
                {Object.entries(orderStatuses).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="order-payment-status">
                Trạng thái thanh toán
              </Form.Label>
              <Form.Select
                id="order-payment-status"
                name="paymentStatus"
                defaultValue={paymentStatus}
              >
                <option value="">Tất cả trạng thái thanh toán</option>
                <option value="pending">Chờ chuyển khoản</option>
                <option value="unpaid">Chưa thu tiền mặt</option>
                <option value="expired">Hết hạn thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="cancelled">Đã hủy</option>
              </Form.Select>
            </Col>
          </Row>
          <div className="d-flex flex-wrap gap-3 align-items-center mt-3">
            <small className="text-secondary">
              Lọc theo ngày đặt hàng (giờ Việt Nam).
            </small>
            <Button
              type="button"
              size="sm"
              variant="link"
              onClick={() => setParams({})}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </Form>
      </Card>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card body className="manager-order-results" aria-busy={loading}>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Đang tải đơn hàng...</span>
            </Spinner>
          </div>
        ) : (
          result && (
            <>
              <div className="mb-3">
                <strong>{result.totalElements}</strong> đơn hàng
              </div>
              {result.content.length ? (
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Khách hàng</th>
                      <th>Ngày đặt</th>
                      <th>Trạng thái đơn</th>
                      <th>Thanh toán</th>
                      <th className="text-end">Tổng tiền</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.content.map((order) => (
                      <tr key={order.orderId}>
                        <td>
                          <Link
                            className="order-code"
                            to={`/manager/orders/${order.orderId}`}
                          >
                            {order.orderId}
                          </Link>
                          <small className="d-block text-secondary">
                            {order.paymentCode}
                          </small>
                        </td>
                        <td>{order.customerName}</td>
                        <td>{formatOrderDate(order.createdAt)}</td>
                        <td>
                          <Badge
                            bg={
                              orderStatuses[order.status]?.variant ??
                              "secondary"
                            }
                          >
                            {orderStatuses[order.status]?.label ?? order.status}
                          </Badge>
                        </td>
                        <td>
                          <div>
                            {order.paymentMethod === "sepay"
                              ? "SePay"
                              : "Tiền mặt"}
                          </div>
                          <Badge
                            bg={
                              order.paymentStatus === "paid"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {{
                              pending: "Chờ chuyển khoản",
                              unpaid: "Chưa thu tiền",
                              paid: "Đã thanh toán",
                              cancelled: "Đã hủy",
                              expired: "Hết hạn thanh toán",
                            }[order.paymentStatus] ?? order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="text-end text-nowrap fw-semibold">
                          {formatCurrency(order.total)}
                        </td>
                        <td>
                          <Button
                            as={Link}
                            to={`/manager/orders/${order.orderId}`}
                            size="sm"
                            variant="outline-primary"
                          >
                            Xem đơn
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center text-secondary py-4 mb-0">
                  Không có đơn hàng phù hợp.
                </p>
              )}
              {result.totalPages > 1 && (
                <nav
                  aria-label="Phân trang đơn hàng"
                  className="d-flex gap-3 align-items-center justify-content-end mt-3"
                >
                  <Button
                    variant="outline-secondary"
                    disabled={page === 0}
                    onClick={() => changePage(page - 1)}
                  >
                    Trước
                  </Button>
                  <span>
                    Trang {page + 1} / {result.totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    disabled={page + 1 >= result.totalPages}
                    onClick={() => changePage(page + 1)}
                  >
                    Sau
                  </Button>
                </nav>
              )}
            </>
          )
        )}
      </Card>
    </div>
  );
}
