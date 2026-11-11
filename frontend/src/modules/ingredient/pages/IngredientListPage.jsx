import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Alert, Badge, Button, Card, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { RotateCcwIcon } from '../../../shared/components/Icons';
import { ingredientApi } from '../api/ingredientApi';
import { compatibleUnitOptions, inputUnit, quantityInputStep } from '../utils/unitConversion';
import { validateStockIn } from '../validators/ingredientValidation';
import { ManagerSummaryStats } from '../../manager/components/ManagerSummaryStats';
import { ManagerPagination } from '../../manager/components/ManagerPagination';
import { useManagerPagination } from '../../manager/hooks/useManagerPagination';

const stockStatus = {
  IN_STOCK: ['Còn hàng', 'success'],
  LOW_STOCK: ['Sắp hết', 'warning'],
  OUT_OF_STOCK: ['Hết hàng', 'danger'],
};

const transactionTypes = {
  IN: 'Nhập kho',
  OUT: 'Xuất kho (lịch sử)',
  ADJUSTMENT: 'Điều chỉnh (lịch sử)',
  ORDER_RESERVE: 'Trừ theo đơn',
  ORDER_RESTORE: 'Hoàn theo đơn',
};

export function IngredientListPage() {
  const historyRequest = useRef(0);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsReady, setStatsReady] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [change, setChange] = useState({ quantity: '', unit: '', note: '' });
  const [saving, setSaving] = useState(false);
  const [stockTouched, setStockTouched] = useState({});
  const [stockSubmitted, setStockSubmitted] = useState(false);
  const [stockServerError, setStockServerError] = useState('');

  useEffect(() => {
    let active = true;
    ingredientApi.list().then(result => {
      if (!active) return;
      setItems(result.data || []);
      setStatsReady(Array.isArray(result.data));
      setError(result.error || '');
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function openStock(item) {
    const requestId = ++historyRequest.current;
    setSelected(item);
    setHistory([]);
    setChange({ quantity: '', unit: inputUnit(item.unit), note: '' });
    setStockTouched({});
    setStockSubmitted(false);
    setStockServerError('');
    const result = await ingredientApi.history(item.id);
    if (requestId !== historyRequest.current) return;
    setHistory(result.data || []);
    if (result.error) setStockServerError(result.error);
  }

  function closeStock() {
    historyRequest.current += 1;
    setSelected(null);
  }

  function changeStockField(name, value) {
    setChange(current => ({ ...current, [name]: value }));
    setStockTouched(current => ({ ...current, [name]: true,
      ...(name === 'unit' ? { quantity: true } : {}) }));
    setStockServerError('');
  }

  async function saveStock(event) {
    event.preventDefault();
    setStockSubmitted(true);
    if (Object.keys(stockErrors).length || saving) return;
    const requestId = historyRequest.current;
    const ingredientId = selected.id;
    setSaving(true);
    const result = await ingredientApi.stockIn(ingredientId, change);
    setSaving(false);
    if (result.error) {
      if (requestId === historyRequest.current) setStockServerError(result.error);
      return;
    }
    const [listResult, historyResult] = await Promise.all([
      ingredientApi.list(), ingredientApi.history(ingredientId),
    ]);
    if (listResult.data) setItems(listResult.data);
    if (listResult.data) setStatsReady(true);
    if (requestId !== historyRequest.current) return;
    if (historyResult.data) setHistory(historyResult.data);
    setStockServerError(listResult.error || historyResult.error || '');
    setSelected(result.data);
    setChange({ quantity: '', unit: inputUnit(result.data.unit), note: '' });
    setStockTouched({});
    setStockSubmitted(false);
  }

  const stockErrors = validateStockIn(change, selected);
  const stockErrorFor = name => stockSubmitted || stockTouched[name] ? stockErrors[name] : '';

  const shown = items.filter(item =>
    (!query || item.name.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))) &&
    (!filterStatus || item.status === filterStatus));
  const { items: pageItems, page, totalPages, start, end, total, setPage, resetPage } = useManagerPagination(shown);

  return <>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="h3 mb-1">Danh sách nguyên liệu</h2>
        <p className="text-secondary mb-0">Quản lý nguyên liệu và tồn kho cho các sản phẩm.</p>
      </div>
      <Button as={Link} to="/manager/ingredients/new">+ Thêm nguyên liệu</Button>
    </div>
    <ManagerSummaryStats ready={statsReady} selected={filterStatus || (query ? null : '')}
      onSelect={value => { setQuery(''); setFilterStatus(value); resetPage(); }} stats={[
        ['Tổng nguyên liệu', items.length, ''],
        ['Sắp hết', items.filter(item => item.status === 'LOW_STOCK').length, 'LOW_STOCK'],
        ['Hết hàng', items.filter(item => item.status === 'OUT_OF_STOCK').length, 'OUT_OF_STOCK'],
      ]} />
    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
    <Card body className="mb-3">
      <div className="d-flex gap-2 flex-wrap align-items-center">
        <Form.Control style={{ maxWidth: 420 }} aria-label="Tìm nguyên liệu"
          placeholder="Tìm tên nguyên liệu..." value={query} onChange={event => { setQuery(event.target.value); resetPage(); }} />
        <Form.Select style={{ maxWidth: 210 }} aria-label="Trạng thái nguyên liệu"
          value={filterStatus} onChange={event => { setFilterStatus(event.target.value); resetPage(); }}>
          <option value="">Mọi trạng thái</option>
          {Object.entries(stockStatus).map(([key, value]) => <option key={key} value={key}>{value[0]}</option>)}
        </Form.Select>
        {(query || filterStatus) && (
          <Button variant="outline-secondary" size="sm" aria-label="Xóa bộ lọc" title="Xóa bộ lọc"
            onClick={() => { setQuery(''); setFilterStatus(''); resetPage(); }}>
            <RotateCcwIcon size={16} />
          </Button>
        )}
      </div>
    </Card>
    <Card body>
      {loading ? (
        <div className="text-center py-4"><Spinner animation="border" role="status" /><span className="visually-hidden">Đang tải...</span></div>
      ) : !shown.length ? (
        <p className="text-center text-muted py-4 mb-0">
          {items.length ? "Không tìm thấy nguyên liệu phù hợp." : "Chưa có nguyên liệu nào. Hãy thêm nguyên liệu đầu tiên."}
        </p>
      ) : (
        <Table responsive hover className="align-middle mb-0">
          <thead><tr>
            <th>Tên nguyên liệu</th><th>Đơn vị</th><th>Tồn kho hiện tại</th>
            <th>Mức cảnh báo</th><th>Trạng thái</th><th>Thao tác</th>
          </tr></thead>
          <tbody>{pageItems.map(item => <tr key={item.id}>
            <td><strong>{item.name}</strong></td>
            <td>{item.unit}</td>
            <td>{item.stockQuantity}</td>
            <td>{item.warningQuantity}</td>
            <td><Badge bg={stockStatus[item.status]?.[1]}>{stockStatus[item.status]?.[0]}</Badge></td>
            <td>
              <div className="d-flex gap-2 flex-wrap">
                <Button as={Link} to={`/manager/ingredients/${item.id}/edit`} size="sm" variant="outline-primary">Sửa</Button>
                <Button size="sm" variant="outline-secondary" onClick={() => openStock(item)}>Nhập kho · Lịch sử</Button>
              </div>
            </td>
          </tr>)}</tbody>
        </Table>
      )}
      {!loading && <ManagerPagination page={page} totalPages={totalPages} start={start} end={end} total={total} onPageChange={setPage} />}
    </Card>
    <Modal show={Boolean(selected)} onHide={closeStock} size="lg">
      <Modal.Header closeButton><Modal.Title>Kho: {selected?.name}</Modal.Title></Modal.Header>
      <Modal.Body>
        {stockServerError && <Alert variant="danger">{stockServerError}</Alert>}
        <Form noValidate onSubmit={saveStock} onBlurCapture={event => {
          if (event.target.name) setStockTouched(current => ({ ...current, [event.target.name]: true }));
        }}>
          <div className="d-flex gap-2 flex-wrap">
            <Form.Group style={{ maxWidth: 190 }}>
              <Form.Control name="quantity" aria-label="Số lượng nhập thêm" type="number"
                min={quantityInputStep(change.unit, selected?.unit)}
                step={quantityInputStep(change.unit, selected?.unit)} required
                placeholder="Số lượng nhập thêm" value={change.quantity}
                onChange={event => changeStockField('quantity', event.target.value)}
                isInvalid={Boolean(stockErrorFor('quantity'))} />
              <Form.Control.Feedback type="invalid">{stockErrorFor('quantity')}</Form.Control.Feedback>
            </Form.Group>
            {compatibleUnitOptions(selected?.unit).length > 1
              ? <Form.Select name="unit" aria-label="Đơn vị giao dịch" value={change.unit}
                  onChange={event => changeStockField('unit', event.target.value)}
                  style={{ maxWidth: 95 }}>
                  {compatibleUnitOptions(selected?.unit).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                </Form.Select>
              : <span className="align-self-center">{selected?.unit}</span>}
            <Form.Group className="flex-grow-1">
              <Form.Control name="note" aria-label="Ghi chú" placeholder="Ghi chú" value={change.note}
                maxLength={500} onChange={event => changeStockField('note', event.target.value)}
                isInvalid={Boolean(stockErrorFor('note'))} />
              <Form.Control.Feedback type="invalid">{stockErrorFor('note')}</Form.Control.Feedback>
            </Form.Group>
          </div>
          <Button type="submit" className="mt-2" disabled={saving}>{saving ? 'Đang lưu...' : 'Nhập kho'}</Button>
        </Form>
        <hr />
        <h3 className="h6">Lịch sử tồn kho</h3>
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          <Table size="sm">
            <thead><tr><th>Thời gian</th><th>Loại</th><th>Thay đổi</th><th>Đơn hàng</th><th>Người thực hiện</th><th>Ghi chú</th></tr></thead>
            <tbody>{history.map(row => <tr key={row.id}>
              <td>{new Date(row.createdAt).toLocaleString('vi-VN')}</td>
              <td>{transactionTypes[row.type] || row.type}</td>
              <td>{Number(row.quantityChange) > 0 ? '+' : ''}{row.quantityChange} {selected?.unit}</td>
              <td>{row.orderId || '—'}</td>
              <td>{row.performedBy || (row.orderId ? 'Hệ thống' : '—')}</td>
              <td>{row.note || '—'}</td>
            </tr>)}</tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  </>;
}
