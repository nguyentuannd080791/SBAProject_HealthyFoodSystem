import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert, Spinner } from 'react-bootstrap';
import { AddProductForm } from '../components/AddProductForm';
import { productApi } from '../api/productApi';

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
    productApi.categories().then(result => {
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
  return <><Link to="/manager/products" className="d-inline-block mb-3">← Danh sách sản phẩm</Link>
    <h2 className="h4 mb-4">Thêm sản phẩm mới</h2>
    <AddProductForm categories={categories} onSave={save} busy={busy} submitError={submitError} serverErrors={serverErrors} />
  </>;
}
