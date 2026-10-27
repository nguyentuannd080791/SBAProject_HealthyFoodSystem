import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useManagerData } from '../hooks/useManagerData';
import { ProductImage } from '../components/ProductImage';
import { categories } from '../data/seed';
import { money } from '../utils/format';

export function ProductListPage() {
  const state = useManagerData('products');
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [actionError, setActionError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);
  const filtered = state.items.filter(product => product.name.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi')) && (!category || product.category === category) && (!availability || product.isAvailable === (availability === 'available')));
  async function toggle(product) {
    setActionError(''); setNotice('');
    const result = await state.setFlag(product.id, 'isAvailable', !product.isAvailable);
    if (result.error) setActionError(result.error);
    else setNotice(`Đã cập nhật trạng thái của ${product.name}.`);
  }
  return <>
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4"><div><h2 className="h4 mb-1">Danh sách sản phẩm</h2><p className="text-muted mb-0">Quản lý món ăn và tình trạng phục vụ mỗi ngày.</p></div><Button as={Link} to="/manager/products/new">+ Thêm sản phẩm</Button></div>
    <Row className="g-3 mb-4">{[['Tổng sản phẩm', state.items.length], ['Còn hàng', state.items.filter(item => item.isAvailable).length], ['Hết hàng', state.items.filter(item => !item.isAvailable).length]].map(([label, count]) => <Col xs={12} sm={4} key={label}><Card body><span className="text-muted">{label}</span><div className="manager-stat">{count}</div></Card></Col>)}</Row>
    {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}
    {(state.error || actionError) && <Alert variant="danger">{state.error || actionError}</Alert>}
    <Card body><Row className="g-3 mb-4"><Col md={5}><Form.Control aria-label="Tìm tên sản phẩm" placeholder="Tìm tên sản phẩm..." value={search} onChange={event => setSearch(event.target.value)} /></Col><Col md={3}><Form.Select aria-label="Lọc danh mục" value={category} onChange={event => setCategory(event.target.value)}><option value="">Tất cả danh mục</option>{categories.map(item => <option key={item}>{item}</option>)}</Form.Select></Col><Col md={3}><Form.Select aria-label="Lọc tình trạng còn hàng" value={availability} onChange={event => setAvailability(event.target.value)}><option value="">Tất cả trạng thái</option><option value="available">Còn hàng</option><option value="unavailable">Hết hàng</option></Form.Select></Col><Col md={1}><Button variant="outline-secondary" title="Xóa bộ lọc" aria-label="Xóa bộ lọc" onClick={() => { setSearch(''); setCategory(''); setAvailability(''); }}>↺</Button></Col></Row>
      {state.loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải...</span></Spinner> : !filtered.length ? <div className="text-center py-5 text-muted">Không tìm thấy sản phẩm. Hãy thêm sản phẩm hoặc thay đổi bộ lọc.</div> : <Table responsive hover className="align-middle mb-0"><thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Tình trạng</th><th className="text-end">Thao tác</th></tr></thead><tbody>{filtered.map(product => <tr key={product.id}><td><div className="d-flex align-items-center gap-3"><ProductImage src={product.image} name={product.name} /><strong className="text-break">{product.name}</strong></div></td><td>{product.category}</td><td className="text-nowrap">{money(product.price)}</td><td><Badge bg={product.isAvailable ? 'success' : 'secondary'}>{product.isAvailable ? 'Còn hàng' : 'Hết hàng'}</Badge></td><td><div className="d-flex justify-content-end gap-2"><Button size="sm" variant="outline-primary" as={Link} to={`/manager/products/${product.id}/edit`}>Sửa</Button><Button size="sm" variant="outline-secondary" disabled={state.busy} onClick={() => toggle(product)}>{product.isAvailable ? 'Đánh dấu hết' : 'Đánh dấu còn'}</Button></div></td></tr>)}</tbody></Table>}
    </Card>
  </>;
}
