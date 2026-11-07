import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { productApi } from '../../product/api/productApi';
import { promotionApi } from '../api/promotionApi';
import { categoryApi } from '../../category/api/categoryApi';
import { PromotionForm } from '../components/PromotionForm';

export function CreatePromotionPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([productApi.list(), categoryApi.listForManager()]).then(([productList, categoryList]) => {
      if (!active) return;
      setProducts(productList.data || []);
      setCategories(categoryList.data || []);
      setLoadError(productList.error || categoryList.error || '');
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function save(values) {
    if (busy) return;
    setBusy(true);
    setSubmitError('');
    const result = await promotionApi.save(values);
    setBusy(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    navigate('/manager/promotions', { state: { notice: 'Đã tạo chương trình khuyến mãi.' } });
  }

  if (loading) return <Spinner animation="border" role="status" />;
  if (loadError) return <Alert variant="danger">{loadError}</Alert>;

  return <>
    <Link to="/manager/promotions" className="d-inline-block mb-3">← Danh sách khuyến mãi</Link>
    <h2 className="h4 mb-4">Tạo chương trình khuyến mãi</h2>
    <Card body>
      <PromotionForm products={products} categories={categories} onSave={save} onCancel={() => navigate('/manager/promotions')}
        busy={busy} submitError={submitError} />
    </Card>
  </>;
}
