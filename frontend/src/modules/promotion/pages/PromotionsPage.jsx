import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { productApi } from '../../product/api/productApi';
import { promotionApi } from '../api/promotionApi';
import { categoryApi } from '../../category/api/categoryApi';
import { PromotionForm } from '../components/PromotionForm';
import { promotionStatus } from '../utils/format';
import { formatCurrency as money } from '../../../shared/utils/formatCurrency';
import { RotateCcwIcon } from '../../../shared/components/Icons';
import { ManagerPagination } from '../../manager/components/ManagerPagination';
import { useManagerPagination } from '../../manager/hooks/useManagerPagination';
import { ManagerSummaryStats } from '../../manager/components/ManagerSummaryStats';

const dateOnly = value => new Date(value).toLocaleDateString('vi-VN');

export function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    let active = true;
    Promise.all([promotionApi.list(), productApi.list(), categoryApi.listAllForManager()]).then(([promotionList, productList, categoryList]) => {
      if (!active) return;
      setLoadError(promotionList.error || productList.error || categoryList.error || '');
      setPromotions(promotionList.data || []);
      setProducts(productList.data || []);
      setCategories(categoryList.data || []);
      setLoading(false);
    });
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const filtered = promotions.filter(item =>
    `${item.name} ${item.code ?? ''}`.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi'))
    && (!status || promotionStatus(item, now).key === status));
  const { items: pageItems, page, totalPages, start, end, total, setPage, resetPage } = useManagerPagination(filtered);

  function open(promotion) { setError(''); setEditor({ promotion }); }

  async function save(values) {
    if (busy) return;
    setBusy(true); setError('');
    const result = await promotionApi.save(values, editor.promotion.id);
    setBusy(false);
    if (result.error) { setError(result.error); return; }
    setPromotions(current => current.map(item => item.id === result.data.id ? result.data : item));
    setEditor(null);
    setNotice('Đã lưu chương trình khuyến mãi.');
  }

  async function toggle(promotion) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    const result = await promotionApi.setEnabled(promotion.id, !promotion.enabled);
    setBusy(false);
    if (result.error) { setError(result.error); return; }
    setPromotions(current => current.map(item => item.id === result.data.id ? result.data : item));
    setNotice(promotion.enabled ? 'Đã tắt chương trình khuyến mãi.' : 'Đã bật chương trình theo thời gian đã thiết lập.');
  }

  return <>
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
      <div><h2 className="h4 mb-1">Chương trình khuyến mãi</h2><p className="text-muted mb-0">Lên lịch ưu đãi cho những món ăn được yêu thích.</p></div>
      <Button as={Link} to="/manager/promotions/new" disabled={loading || !!loadError}>+ Tạo khuyến mãi</Button>
    </div>
    <ManagerSummaryStats ready={!loading && !loadError} selected={status || (search ? null : '')}
      onSelect={value => { setSearch(''); setStatus(value); resetPage(); }} stats={[
        ['Tổng chương trình', promotions.length, ''],
        ['Đang áp dụng', promotions.filter(item => promotionStatus(item, now).key === 'active').length, 'active'],
        ['Sắp diễn ra', promotions.filter(item => promotionStatus(item, now).key === 'scheduled').length, 'scheduled'],
      ]} />
    {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}
    {(loadError || (!editor && error)) && <Alert variant="danger">{loadError || error}</Alert>}
    <Card body>
      <Row className="g-3 mb-4">
        <Col md={7}><Form.Control aria-label="Tìm tên khuyến mãi" placeholder="Tìm tên chương trình..." value={search} onChange={event => { setSearch(event.target.value); resetPage(); }} /></Col>
        <Col md={4}><Form.Select aria-label="Lọc trạng thái khuyến mãi" value={status} onChange={event => { setStatus(event.target.value); resetPage(); }}><option value="">Tất cả trạng thái</option><option value="active">Đang áp dụng</option><option value="scheduled">Sắp diễn ra</option><option value="expired">Đã kết thúc</option><option value="disabled">Tạm tắt</option></Form.Select></Col>
        <Col md={1}><Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center" aria-label="Xóa bộ lọc" title="Xóa bộ lọc" onClick={() => { setSearch(''); setStatus(''); resetPage(); }}><RotateCcwIcon size={16} /></Button></Col>
      </Row>
      {loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải...</span></Spinner>
        : !filtered.length ? <div className="text-center py-5"><h3 className="h5">Chưa có chương trình phù hợp</h3><p className="text-muted mb-0">Tạo ưu đãi đầu tiên hoặc thay đổi bộ lọc tìm kiếm.</p></div>
          : <Table responsive hover className="align-middle mb-0">
            <thead><tr><th>Chương trình</th><th>Mức giảm</th><th>Thời gian</th><th>Trạng thái</th><th className="text-end">Thao tác</th></tr></thead>
            <tbody>{pageItems.map(promotion => {
              const current = promotionStatus(promotion, now);
              return <tr key={promotion.id}>
                <td><strong className="text-break">{promotion.name}</strong><code className="d-block mt-1">{promotion.code}</code></td>
                <td className="text-nowrap fw-semibold text-success">{promotion.type === 'percentage' ? `${promotion.value}%` : money(promotion.value)}</td>
                <td className="small text-nowrap"><div>Từ ngày {dateOnly(promotion.startsAt)}</div><div className="text-muted">Đến ngày {dateOnly(promotion.endsAt)}</div></td>
                <td><Badge bg={current.color}>{current.label}</Badge></td>
                <td><div className="d-flex justify-content-end gap-2"><Button variant="outline-primary" size="sm" disabled={!!loadError} onClick={() => open(promotion)}>Sửa</Button><Button variant={promotion.enabled ? 'outline-secondary' : 'outline-success'} size="sm" disabled={busy} onClick={() => toggle(promotion)}>{promotion.enabled ? 'Tắt' : 'Bật'}</Button></div></td>
              </tr>;
            })}</tbody>
          </Table>}
      {!loading && !loadError && <ManagerPagination page={page} totalPages={totalPages} start={start} end={end} total={total} onPageChange={setPage} />}
    </Card>
    <Modal show={!!editor} onHide={() => { if (!busy) setEditor(null); }} centered size="lg" backdrop={busy ? 'static' : true} keyboard={!busy}>
      <Modal.Header closeButton={!busy}><Modal.Title as="h2" className="h5">Chỉnh sửa khuyến mãi</Modal.Title></Modal.Header>
      <Modal.Body>{editor && <PromotionForm promotion={editor.promotion} products={products} categories={categories} promotions={promotions} onSave={save} onCancel={() => setEditor(null)} busy={busy} submitError={error} />}</Modal.Body>
    </Modal>
  </>;
}
