import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { productApi } from '../../product/api/productApi';
import { promotionApi } from '../api/promotionApi';
import { categoryApi } from '../../category/api/categoryApi';
import { PromotionForm } from '../components/PromotionForm';
import { PlusIcon, SparklesIcon } from '../../../shared/components/Icons';

export function CreatePromotionPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([productApi.list(), categoryApi.listForManager(), promotionApi.list()]).then(([productList, categoryList, promotionList]) => {
      if (!active) return;
      setProducts(productList.data || []);
      setCategories(categoryList.data || []);
      setPromotions(promotionList.data || []);
      setLoadError(productList.error || categoryList.error || promotionList.error || '');
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

  return <div>
    <nav className="manager-breadcrumb" aria-label="Đường dẫn">
      <Link to="/manager" aria-label="Trang quản lý"><SparklesIcon size={18} /></Link>
      <span aria-hidden="true">›</span>
      <Link to="/manager/promotions">Khuyến mãi</Link>
      <span aria-hidden="true">›</span>
      <span aria-current="page">Tạo khuyến mãi</span>
    </nav>
    <div className="manager-product-title">
      <span><PlusIcon size={27} /></span>
      <div>
        <h2 className="h4 mb-0">Tạo chương trình khuyến mãi</h2>
        <p className="text-secondary small mb-0">Lên lịch ưu đãi cho những món ăn được yêu thích.</p>
      </div>
    </div>
    <Card body>
      <PromotionForm products={products} categories={categories} promotions={promotions}
        onSave={save} onCancel={() => navigate('/manager/promotions')}
        busy={busy} submitError={submitError} />
    </Card>
  </div>;
}
