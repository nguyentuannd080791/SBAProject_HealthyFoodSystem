import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Alert, Spinner } from 'react-bootstrap';
import { useManagerData } from '../hooks/useManagerData';
import { ProductForm } from '../components/ProductForm';

export function ProductEditorPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const state = useManagerData('products');
  const [error, setError] = useState('');
  const product = state.items.find(item => item.id === productId);
  async function save(values) {
    setError('');
    const result = await state.save(values, productId);
    if (result.error) setError(result.error);
    else navigate('/manager/products', { state: { notice: productId ? 'Đã cập nhật sản phẩm.' : 'Đã thêm sản phẩm mới.' } });
  }
  if (state.loading) return <Spinner role="status" animation="border"><span className="visually-hidden">Đang tải...</span></Spinner>;
  if (state.error) return <Alert variant="danger">{state.error}</Alert>;
  if (productId && !product) return <Alert variant="warning">Không tìm thấy sản phẩm. <Link to="/manager/products">Về danh sách</Link></Alert>;
  return <><Link to="/manager/products" className="d-inline-block mb-3">← Danh sách sản phẩm</Link><h2 className="h4 mb-4">{productId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2><ProductForm key={productId || 'new'} product={product} onSave={save} onCancel={() => navigate('/manager/products')} busy={state.busy} submitError={error} /></>;
}
