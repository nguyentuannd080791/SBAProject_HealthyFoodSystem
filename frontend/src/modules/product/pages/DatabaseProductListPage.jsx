import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Alert, Button, Card, Form, Spinner, Table } from 'react-bootstrap';
import { productApi } from '../api/productApi';
import { promotionApi } from '../../promotion/api/promotionApi';
import { categoryApi } from '../../category/api/categoryApi';
import { ProductImage } from '../components/ProductImage';
import { formatCurrency as money } from '../../../shared/utils/formatCurrency';
import { bestActivePromotion } from '../../promotion/utils/promotionPricing';
import { RotateCcwIcon } from '../../../shared/components/Icons';
import { httpClient } from '../../../shared/api/httpClient';

function imageSource(path) {
  if (!path) return '';
  try { return new URL(path, httpClient.defaults.baseURL).href; } catch { return ''; }
}

export function DatabaseProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [now, setNow] = useState(Date.now);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const location = useLocation();
  const [categoryId, setCategoryId] = useState(() => new URLSearchParams(location.search).get('categoryId') || '');
  const [promotionFilter, setPromotionFilter] = useState('');
  const navigate = useNavigate();
  const [notice, setNotice] = useState(location.state?.notice || '');
  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);
  useEffect(() => {
    setCategoryId(new URLSearchParams(location.search).get('categoryId') || '');
  }, [location.search]);
  useEffect(() => {
    let active = true;
    Promise.all([productApi.list(), categoryApi.listAllForManager(), promotionApi.list()]).then(([list, categoryList, promotionList]) => {
      if (!active) return;
      setError(list.error || categoryList.error || promotionList.error || '');
      setProducts(list.data || []);
      setCategories(categoryList.data || []);
      setPromotions(promotionList.data || []);
      setLoading(false);
    });
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  const filtered = products
    .map(product => ({ product, pricing: bestActivePromotion(product, promotions, now) }))
    .filter(({ product, pricing }) => product.name.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi'))
      && (!categoryId || String(product.categoryId) === categoryId)
      && (!promotionFilter || (promotionFilter === 'active' ? !!pricing : !pricing)));
  return <>
    <div className="d-flex justify-content-between align-items-center mb-4"><h2 className="h4 mb-0">Danh sách sản phẩm</h2>
      <Button as={Link} to="/manager/products/new">+ Thêm sản phẩm</Button></div>
    {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}
    {error && <Alert variant="danger">{error}</Alert>}
    <Card body><div className="d-flex gap-3 mb-4 flex-wrap align-items-center">
      <Form.Control style={{ maxWidth: 360 }} placeholder="Tìm tên sản phẩm..." aria-label="Tìm tên sản phẩm" value={search} onChange={event => setSearch(event.target.value)} />
      <Form.Select style={{ maxWidth: 260 }} aria-label="Lọc danh mục" value={categoryId} onChange={event => setCategoryId(event.target.value)}>
        <option value="">Tất cả danh mục</option>{categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </Form.Select>
      <Form.Select style={{ maxWidth: 260 }} aria-label="Lọc khuyến mại" value={promotionFilter} onChange={event => setPromotionFilter(event.target.value)}>
        <option value="">Tất cả sản phẩm</option>
        <option value="active">Đang khuyến mại</option>
        <option value="inactive">Không khuyến mại</option>
      </Form.Select>
      {(search || categoryId || promotionFilter) && (
        <Button variant="outline-secondary" size="sm" aria-label="Xóa bộ lọc" title="Xóa bộ lọc"
          onClick={() => { setSearch(''); setCategoryId(''); setPromotionFilter(''); }}>
          <RotateCcwIcon size={16} />
        </Button>
      )}</div>
      {loading ? <Spinner animation="border" role="status" /> : error ? null : !filtered.length ? (
        <p className="text-muted text-center py-4 mb-0">{products.length ? "Không tìm thấy sản phẩm phù hợp." : "Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên."}</p>
      ) : <Table responsive hover className="align-middle mb-0" style={{ minWidth: 1100 }}><thead><tr>
        <th>Sản phẩm</th><th>Danh mục</th><th>Giá gốc</th><th>Giá sau giảm</th><th>Khuyến mại</th><th>Combo</th><th>Trạng thái kho</th><th>Trạng thái bán</th><th>Thao tác</th>
      </tr></thead><tbody>{filtered.map(({ product, pricing }) => <tr key={product.id}>
        <td><div className="d-flex align-items-center gap-3"><ProductImage src={imageSource(product.imageUrl)} name={product.name} /><strong>{product.name}</strong></div></td>
        <td>{categories.find(item => item.id === product.categoryId)?.name || `#${product.categoryId}`}</td>
        <td>{money(product.price)}</td>
        <td>{pricing ? money(pricing.price) : '—'}</td>
        <td>{pricing ? pricing.promotion.name : 'Không áp dụng'}</td>
        <td>{product.availableQuantity ?? 0} combo</td>
        <td>{!product.recipeConfigured ? 'Chưa có công thức' : product.inventoryStatus === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Còn hàng'}</td>
        <td>{product.status === 'AVAILABLE' ? 'Đang bán' : product.status === 'UNAVAILABLE' ? 'Ngừng bán' : product.status}</td>
        <td><Button as={Link} to={`/manager/products/${product.id}/edit`} size="sm" variant="outline-primary">Sửa</Button></td>
      </tr>)}</tbody></Table>}
    </Card>
  </>;
}
