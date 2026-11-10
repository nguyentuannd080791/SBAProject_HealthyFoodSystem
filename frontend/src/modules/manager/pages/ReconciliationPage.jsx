import { useEffect, useState } from "react";
import { Alert, Button, Card, Spinner, Table } from "react-bootstrap";
import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatOrderDate } from "../../orders/utils/orderFormatting";

const labels = { LATE_PAYMENT: "Nhận tiền khi đơn đã hết hạn", UNMATCHED: "Không khớp đơn", AMOUNT_MISMATCH: "Sai số tiền", REQUIRES_REVIEW: "Cần kiểm tra" };
export function ReconciliationPage() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    callApi(() => httpClient.get("/api/manager/reconciliation", { params: { page } })).then((result) => {
      if (!active) return;
      setData(result.data ?? null); setError(result.error ?? ""); setLoading(false);
    });
    return () => { active = false; };
  }, [page, refresh]);
  return <div className="manager-orders-page">
    <div className="d-flex flex-wrap justify-content-between gap-3 mb-3"><div><h2 className="h4">Đối soát thanh toán</h2>
      <p className="text-secondary">Giao dịch đã nhận nhưng chưa xác nhận tự động cho đơn.</p></div>
      <Button disabled={loading} onClick={() => setRefresh((value) => value + 1)}>Làm mới</Button></div>
    <Alert variant="warning">Không yêu cầu khách chuyển tiền lần nữa. Kiểm tra thời gian ngân hàng và số tiền, liên hệ khách để xử lý hoặc hoàn tiền thủ công. Không tự mở lại đơn đã hoàn kho.</Alert>
    {error && <Alert variant="danger">{error}</Alert>}
    <Card body>{loading ? <Spinner animation="border" role="status" /> : data && <>
      <p>{data.totalElements} giao dịch cần kiểm tra</p>
      <Table responsive><thead><tr><th>ID / mã</th><th>Số tiền</th><th>Kết quả</th><th>Thời gian ngân hàng</th><th>Nhận webhook</th><th>Nội dung</th></tr></thead>
        <tbody>{data.content.map((item) => <tr key={item.id}><td>{item.id}<small className="d-block">{item.code || "Không có mã"}</small></td>
          <td className="text-nowrap">{formatCurrency(item.amount)}</td><td>{labels[item.reconciliationStatus] ?? item.reconciliationStatus}</td>
          <td>{item.bankTransactionDate || "Không có dữ liệu"}</td><td>{formatOrderDate(item.receivedAt)}</td><td className="text-break">{item.content}</td></tr>)}</tbody></Table>
      {!data.content.length && <p className="text-center text-secondary">Chưa có giao dịch cần đối soát.</p>}
      <div className="d-flex gap-3 justify-content-end align-items-center"><Button disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</Button>
        <span>Trang {page + 1}/{Math.max(1, data.totalPages)}</span><Button disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Sau</Button></div>
    </>}</Card>
  </div>;
}
