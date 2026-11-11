import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert, Spinner } from 'react-bootstrap';
import { AddProductForm } from '../components/AddProductForm';
import { productApi } from '../api/productApi';
import { categoryApi } from '../../category/api/categoryApi';
import { PlusIcon, ShoppingBagIcon } from '../../../shared/components/Icons';

export function AddProductPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [serverErrors, setServerErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    categoryApi.listForManager().then(result => {
      if (!active) return;
      setCategories(result.data || []);
      setLoadError(result.error || '');
      setLoading(false);
    });
    return () => { active = false; };
  }, []);
  async function save(values) {
    if (busy) return;
    setBusy(true); setSubmitError(''); setServerErrors({});
    const result = await productApi.create(values);
    setBusy(false);
    if (result.error) { setSubmitError(result.error); setServerErrors(result.validationErrors || {}); return; }
    navigate('/manager/products', { state: { notice: 'Đã thêm sản phẩm mới.' } });
  }
  if (loading) return <Spinner animation="border" role="status" />;
  if (loadError) return <Alert variant="danger">{loadError}</Alert>;
  return (
    <div className="manager-product-editor">
      <nav className="manager-breadcrumb" aria-label="Đường dẫn">
        <Link to="/manager" aria-label="Trang quản lý"><ShoppingBagIcon size={18} /></Link>
        <span aria-hidden="true">›</span>
        <Link to="/manager/products">Sản phẩm</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Thêm sản phẩm</span>
      </nav>
      <div className="manager-product-title"><span><PlusIcon size={27} /></span><h2>Thêm sản phẩm mới</h2></div>
      <AddProductForm categories={categories} onSave={save} busy={busy} submitError={submitError} serverErrors={serverErrors} />
    </div>
  );
}
