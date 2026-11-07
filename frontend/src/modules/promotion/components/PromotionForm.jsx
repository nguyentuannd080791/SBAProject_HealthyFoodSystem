import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { FormField } from '../../../shared/components/FormField';
import { validatePromotion } from '../validators/promotionValidation';
import { toLocalInput } from '../utils/format';
import { formatCurrency as money } from '../../../shared/utils/formatCurrency';

export function PromotionForm({ promotion, products, categories, onSave, onCancel, busy, submitError }) {
  const [values, setValues] = useState(promotion
    ? { ...promotion, startsAt: toLocalInput(promotion.startsAt), endsAt: toLocalInput(promotion.endsAt) }
    : { name: '', type: 'percentage', value: '', productIds: [], startsAt: '', endsAt: '', enabled: true });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(() => [...new Set(
    products.filter(product => promotion?.productIds.includes(product.id)).map(product => product.categoryId),
  )]);
  const [errors, setErrors] = useState({});
  const availableProducts = products.filter(product => selectedCategoryIds.includes(product.categoryId));
  const allCategoriesSelected = categories.length > 0 && categories.every(category => selectedCategoryIds.includes(category.id));
  const allProductsSelected = availableProducts.length > 0 && availableProducts.every(product => values.productIds.includes(product.id));

  function change(event) {
    const { name, value, checked, type } = event.target;
    setValues(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors(current => ({ ...current, [name]: '' }));
  }

  function selectCategory(id, checked) {
    setSelectedCategoryIds(current => checked ? [...current, id] : current.filter(categoryId => categoryId !== id));
    if (!checked) {
      const removedProductIds = new Set(products.filter(product => product.categoryId === id).map(product => product.id));
      setValues(current => ({ ...current, productIds: current.productIds.filter(productId => !removedProductIds.has(productId)) }));
    }
  }

  function selectAllCategories(checked) {
    setSelectedCategoryIds(checked ? categories.map(category => category.id) : []);
    if (!checked) setValues(current => ({ ...current, productIds: [] }));
  }

  function selectProduct(id, checked) {
    setValues(current => ({ ...current, productIds: checked
      ? [...new Set([...current.productIds, id])]
      : current.productIds.filter(productId => productId !== id) }));
    setErrors(current => ({ ...current, productIds: '' }));
  }

  function selectAllProducts(checked) {
    const availableIds = new Set(availableProducts.map(product => product.id));
    setValues(current => ({ ...current, productIds: checked
      ? [...new Set([...current.productIds, ...availableIds])]
      : current.productIds.filter(id => !availableIds.has(id)) }));
    setErrors(current => ({ ...current, productIds: '' }));
  }

  function submit(event) {
    event.preventDefault();
    const found = validatePromotion(values, availableProducts);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSave({ name: values.name.trim(), type: values.type, value: Number(values.value), productIds: values.productIds,
      startsAt: new Date(values.startsAt).toISOString(), endsAt: new Date(values.endsAt).toISOString(), enabled: values.enabled });
  }

  return <Form noValidate onSubmit={submit}>
    {submitError && <Alert variant="danger">{submitError}</Alert>}
    <fieldset disabled={busy}>
      <FormField label="Tên chương trình *" name="name" value={values.name} maxLength={120} onChange={change} error={errors.name} placeholder="Ví dụ: Tuần lễ ăn xanh" />
      <Row><Col md={6}><Form.Group className="mb-3" controlId="promotion-type"><Form.Label>Hình thức giảm *</Form.Label><Form.Select name="type" value={values.type} onChange={change}><option value="percentage">Giảm theo phần trăm</option><option value="fixed">Giảm theo số tiền</option></Form.Select></Form.Group></Col><Col md={6}><FormField label={values.type === 'percentage' ? 'Mức giảm (%) *' : 'Mức giảm (VNĐ) *'} name="value" type="number" min="0" step={values.type === 'percentage' ? '0.01' : '1'} max={values.type === 'percentage' ? '100' : undefined} value={values.value} onChange={change} error={errors.value} /></Col></Row>
      <Row><Col md={6}><FormField label="Bắt đầu *" name="startsAt" type="datetime-local" value={values.startsAt} onChange={change} error={errors.startsAt} /></Col><Col md={6}><FormField label="Kết thúc *" name="endsAt" type="datetime-local" value={values.endsAt} onChange={change} error={errors.endsAt} /></Col></Row>
      <p className="small text-muted">Thời gian theo múi giờ của thiết bị. Chương trình đã hết hạn cần sửa thời gian để áp dụng lại.</p>

      <fieldset className="mb-3"><legend className="fs-6">Danh mục áp dụng ({selectedCategoryIds.length} đã chọn)</legend>
        <Form.Check className="mb-2 fw-semibold" id="promotion-all-categories" label="Chọn tất cả danh mục" checked={allCategoriesSelected} disabled={!categories.length} onChange={event => selectAllCategories(event.target.checked)} />
        <div className="manager-products-picker">{categories.length
          ? categories.map(category => <Form.Check className="mb-2" key={category.id} id={`promotion-category-${category.id}`} label={category.name} checked={selectedCategoryIds.includes(category.id)} onChange={event => selectCategory(category.id, event.target.checked)} />)
          : <span className="text-muted">Chưa có danh mục. Hãy thêm danh mục trước.</span>}</div>
      </fieldset>

      <fieldset className="mb-3"><legend className="fs-6">Sản phẩm áp dụng * ({values.productIds.length} đã chọn)</legend>
        <Form.Check className="mb-2 fw-semibold" id="promotion-all-products" label="Chọn tất cả sản phẩm trong danh mục đã chọn" checked={allProductsSelected} disabled={!availableProducts.length} onChange={event => selectAllProducts(event.target.checked)} />
        <div className="manager-products-picker">{!selectedCategoryIds.length
          ? <span className="text-muted">Chọn danh mục để xem sản phẩm.</span>
          : availableProducts.length
            ? availableProducts.map(product => <Form.Check className="mb-2" key={product.id} id={`promotion-product-${product.id}`} label={`${product.name} · ${money(product.price)} · tồn kho ${product.stockQuantity ?? 0}`} checked={values.productIds.includes(product.id)} onChange={event => selectProduct(product.id, event.target.checked)} />)
            : <span className="text-muted">Danh mục đã chọn chưa có sản phẩm.</span>}</div>
        {errors.productIds && <div className="text-danger small mt-1" role="alert">{errors.productIds}</div>}
      </fieldset>
      <Form.Check type="switch" id="promotion-enabled" name="enabled" label="Bật chương trình theo lịch đã chọn" checked={values.enabled} onChange={change} />
      <div className="d-flex justify-content-end gap-2 mt-4"><Button variant="outline-secondary" onClick={onCancel}>Hủy</Button><Button type="submit" disabled={!products.length || !categories.length}>{busy ? 'Đang lưu...' : promotion ? 'Lưu thay đổi' : 'Tạo khuyến mãi'}</Button></div>
    </fieldset>
  </Form>;
}
