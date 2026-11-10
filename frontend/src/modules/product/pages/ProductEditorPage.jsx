import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Alert, Spinner } from 'react-bootstrap';
import { AddProductForm } from '../components/AddProductForm';
import { productApi } from '../api/productApi';
import { categoryApi } from '../../category/api/categoryApi';
import { PencilIcon, ShoppingBagIcon } from '../../../shared/components/Icons';

export function ProductEditorPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    let active = true;
    Promise.all([productApi.get(productId), categoryApi.listForManager()]).then(([item, categoryList]) => {
      if (!active) return;
      setNotFound(Boolean(item.notFound));
      setLoadError(item.error || categoryList.error || '');
      setProduct(item.data || null);
      setCategories(categoryList.data || []);
      setLoading(false);
    });
    return () => { active = false; };
  }, [productId]);

  async function save(values) {
    if (busy) return;
    setBusy(true); setSubmitError(''); setServerErrors({});
    const result = await productApi.update(productId, values);
    setBusy(false);
    if (result.error) {
      setSubmitError(result.error);
      setServerErrors(result.validationErrors || {});
      return;
    }
    navigate('/manager/products', { state: { notice: 'Đã cập nhật sản phẩm.' } });
  }

  if (loading) return <Spinner animation="border" role="status" />;
  if (notFound) return <Alert variant="warning">Không tìm thấy sản phẩm. <Link to="/manager/products">Về danh sách</Link></Alert>;
  if (loadError) return <Alert variant="danger">{loadError} <Link to="/manager/products">Về danh sách</Link></Alert>;
  return <div className="manager-product-editor">
    <nav className="manager-breadcrumb" aria-label="Đường dẫn">
      <Link to="/manager" aria-label="Trang quản lý"><ShoppingBagIcon size={18} /></Link>
      <span aria-hidden="true">›</span>
      <Link to="/manager/products">Sản phẩm</Link>
      <span aria-hidden="true">›</span>
      <Link to="/manager/products">Danh sách sản phẩm</Link>
      <span aria-hidden="true">›</span>
      <span aria-current="page">Chỉnh sửa sản phẩm</span>
    </nav>
    <div className="manager-product-title"><span><PencilIcon size={27} /></span><h2>Chỉnh sửa sản phẩm</h2></div>
    <AddProductForm key={productId} product={product} categories={categories} onSave={save}
      busy={busy} submitError={submitError} serverErrors={serverErrors} />
  </div>;
}
