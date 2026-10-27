import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { useManagerData } from '../hooks/useManagerData';
import { PromotionForm } from '../components/PromotionForm';
import { dateTime, money, promotionStatus } from '../utils/format';

export function PromotionsPage() {
  const promotions = useManagerData('promotions');
  const products = useManagerData('products');
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const filtered = promotions.items.filter(item => item.name.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi')) && (!status || promotionStatus(item, now).key === status));
  function open(promotion = null) { setError(''); setEditor({ promotion }); }
  async function save(values) {
    setError('');
    const result = await promotions.save(values, editor.promotion?.id);
    if (result.error) setError(result.error);
    else { setEditor(null); setNotice('Đã lưu chương trình khuyến mãi.'); }
  }
  async function toggle(promotion) {
    setError(''); setNotice('');
    const result = await promotions.setFlag(promotion.id, 'enabled', !promotion.enabled);
    if (result.error) setError(result.error);
    else setNotice(promotion.enabled ? 'Đã tắt chương trình khuyến mãi.' : 'Đã bật chương trình theo thời gian đã thiết lập.');
  }
  return <>
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4"><div><h2 className="h4 mb-1">Chương trình khuyến mãi</h2><p className="text-muted mb-0">Lên lịch ưu đãi cho những món ăn được yêu thích.</p></div><Button onClick={() => open()} disabled={products.loading || !!products.error || !!promotions.error}>+ Tạo khuyến mãi</Button></div>
    <Row className="g-3 mb-4">{[['Tổng chương trình', promotions.items.length], ['Đang áp dụng', promotions.items.filter(item => promotionStatus(item, now).key === 'active').length], ['Sắp diễn ra', promotions.items.filter(item => promotionStatus(item, now).key === 'scheduled').length]].map(([label, count]) => <Col xs={12} sm={4} key={label}><Card body><span className="text-muted">{label}</span><div className="manager-stat">{count}</div></Card></Col>)}</Row>
    {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}
    {(promotions.error || products.error || (!editor && error)) && <Alert variant="danger">{promotions.error || products.error || error}</Alert>}
    <Card body><Row className="g-3 mb-4"><Col md={7}><Form.Control aria-label="Tìm tên khuyến mãi" placeholder="Tìm tên chương trình..." value={search} onChange={event => setSearch(event.target.value)} /></Col><Col md={4}><Form.Select aria-label="Lọc trạng thái khuyến mãi" value={status} onChange={event => setStatus(event.target.value)}><option value="">Tất cả trạng thái</option><option value="active">Đang áp dụng</option><option value="scheduled">Sắp diễn ra</option><option value="expired">Đã kết thúc</option><option value="disabled">Tạm tắt</option></Form.Select></Col><Col md={1}><Button variant="outline-secondary" aria-label="Xóa bộ lọc" title="Xóa bộ lọc" onClick={() => { setSearch(''); setStatus(''); }}>↺</Button></Col></Row>
      {promotions.loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải...</span></Spinner> : !filtered.length ? <div className="text-center py-5"><h3 className="h5">Chưa có chương trình phù hợp</h3><p className="text-muted mb-0">Tạo ưu đãi đầu tiên hoặc thay đổi bộ lọc tìm kiếm.</p></div> : <Table responsive hover className="align-middle mb-0"><thead><tr><th>Chương trình</th><th>Mức giảm</th><th>Thời gian</th><th>Trạng thái</th><th className="text-end">Thao tác</th></tr></thead><tbody>{filtered.map(promotion => {
        const current = promotionStatus(promotion, now);
        return <tr key={promotion.id}><td><strong className="text-break">{promotion.name}</strong><div className="small text-muted mt-1">{promotion.productIds.map(id => products.items.find(product => product.id === id)?.name || 'Sản phẩm không còn tồn tại').join(', ')}</div></td><td className="text-nowrap fw-semibold text-success">{promotion.type === 'percentage' ? `${promotion.value}%` : money(promotion.value)}</td><td className="small text-nowrap"><div>{dateTime(promotion.startsAt)}</div><div className="text-muted">đến {dateTime(promotion.endsAt)}</div></td><td><Badge bg={current.color}>{current.label}</Badge></td><td><div className="d-flex justify-content-end gap-2"><Button variant="outline-primary" size="sm" disabled={!!products.error} onClick={() => open(promotion)}>Sửa</Button><Button variant={promotion.enabled ? 'outline-secondary' : 'outline-success'} size="sm" disabled={promotions.busy} onClick={() => toggle(promotion)}>{promotion.enabled ? 'Tắt' : 'Bật'}</Button></div></td></tr>;
      })}</tbody></Table>}
    </Card>
    <Modal show={!!editor} onHide={() => { if (!promotions.busy) setEditor(null); }} centered size="lg" backdrop={promotions.busy ? 'static' : true} keyboard={!promotions.busy} className="manager-area"><Modal.Header closeButton={!promotions.busy}><Modal.Title as="h2" className="h5">{editor?.promotion ? 'Chỉnh sửa khuyến mãi' : 'Tạo chương trình khuyến mãi'}</Modal.Title></Modal.Header><Modal.Body>{editor && <PromotionForm promotion={editor.promotion} products={products.items} onSave={save} onCancel={() => setEditor(null)} busy={promotions.busy} submitError={error} />}</Modal.Body></Modal>
  </>;
}
