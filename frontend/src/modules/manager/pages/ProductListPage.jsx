import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useManagerData } from '../hooks/useManagerData';
import { ProductImage } from '../components/ProductImage';
import { categories } from '../data/seed';
import { money } from '../utils/format';
import { matchesQuantityFilter, quantityLabel, validQuantity } from '../utils/productQuantity';

export function ProductListPage() {
  const state = useManagerData('products');
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');
  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const unknownCount = state.items.filter(item => !validQuantity(item.quantity)).length;
  const totalQuantity = state.items.reduce((total, item) => total + (validQuantity(item.quantity) ? item.quantity : 0), 0);
  const filtered = state.items.filter(product =>
    product.name.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi'))
    && (!category || product.category === category)
    && matchesQuantityFilter(product, quantityFilter));
  const stats = [
    ['Tổng sản phẩm', state.items.length],
    ['Tổng số lượng đã nhập', totalQuantity],
    ['Sản phẩm có số lượng 0', state.items.filter(item => item.quantity === 0).length],
    ['Chưa nhập số lượng', unknownCount],
  ];

  return <>
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
      <div><h2 className="h4 mb-1">Danh sách sản phẩm</h2><p className="text-muted mb-0">Quản lý món ăn và số lượng hiện có thể bán.</p></div>
      <Button as={Link} to="/manager/products/new">+ Thêm sản phẩm</Button>
    </div>
    <Row className="g-3 mb-4">{stats.map(([label, count]) =>
      <Col xs={12} sm={6} xl={3} key={label}><Card body><span className="text-muted">{label}</span><div className="manager-stat">{count.toLocaleString('vi-VN')}</div></Card></Col>)}</Row>
    {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}
    {state.error && <Alert variant="danger">{state.error}</Alert>}
    {unknownCount > 0 && <Alert variant="warning">Có {unknownCount} sản phẩm chưa có số lượng cụ thể. Chọn “Sửa” để nhập số lượng hiện có thể bán. Tổng số lượng chưa bao gồm các sản phẩm này.</Alert>}
    <Card body>
      <Row className="g-3 mb-4">
        <Col md={5}><Form.Control aria-label="Tìm tên sản phẩm" placeholder="Tìm tên sản phẩm..." value={search} onChange={event => setSearch(event.target.value)} /></Col>
        <Col md={3}><Form.Select aria-label="Lọc danh mục" value={category} onChange={event => setCategory(event.target.value)}><option value="">Tất cả danh mục</option>{categories.map(item => <option key={item}>{item}</option>)}</Form.Select></Col>
        <Col md={3}><Form.Select aria-label="Lọc số lượng" value={quantityFilter} onChange={event => setQuantityFilter(event.target.value)}>
          <option value="">Tất cả số lượng</option><option value="positive">Số lượng lớn hơn 0</option><option value="zero">Số lượng bằng 0</option><option value="unknown">Chưa nhập số lượng</option>
        </Form.Select></Col>
        <Col md={1}><Button variant="outline-secondary" title="Xóa bộ lọc" aria-label="Xóa bộ lọc" onClick={() => { setSearch(''); setCategory(''); setQuantityFilter(''); }}>↺</Button></Col>
      </Row>
      {state.loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải...</span></Spinner>
        : !filtered.length ? <div className="text-center py-5 text-muted">Không tìm thấy sản phẩm. Hãy thêm sản phẩm hoặc thay đổi bộ lọc.</div>
          : <Table responsive hover className="align-middle mb-0">
            <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Số lượng có thể bán</th><th className="text-end">Thao tác</th></tr></thead>
            <tbody>{filtered.map(product => <tr key={product.id}>
              <td><div className="d-flex align-items-center gap-3"><ProductImage src={product.image} name={product.name} /><strong className="text-break">{product.name}</strong></div></td>
              <td>{product.category}</td><td className="text-nowrap">{money(product.price)}</td>
              <td><Badge bg={!validQuantity(product.quantity) ? 'warning' : product.quantity === 0 ? 'secondary' : 'success'} text={!validQuantity(product.quantity) ? 'dark' : undefined}>{quantityLabel(product.quantity)}</Badge></td>
              <td className="text-end"><Button size="sm" variant="outline-primary" as={Link} to={`/manager/products/${product.id}/edit`}>Sửa</Button></td>
            </tr>)}</tbody>
          </Table>}
    </Card>
  </>;
}
