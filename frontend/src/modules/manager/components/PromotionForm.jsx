import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { FormField } from '../../../shared/components/FormField';
import { validatePromotion } from '../validation/validators';
import { money, toLocalInput } from '../utils/format';
import { quantityLabel } from '../utils/productQuantity';

export function PromotionForm({ promotion, products, onSave, onCancel, busy, submitError }) {
  const [values, setValues] = useState(promotion ? { ...promotion, startsAt: toLocalInput(promotion.startsAt), endsAt: toLocalInput(promotion.endsAt) } : { name: '', type: 'percentage', value: '', productIds: [], startsAt: '', endsAt: '', enabled: true });
  const [errors, setErrors] = useState({});
  function change(event) {
    const { name, value, checked, type } = event.target;
    setValues(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors(current => ({ ...current, [name]: '' }));
  }
  function submit(event) {
    event.preventDefault();
    const found = validatePromotion(values, products);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSave({ name: values.name.trim(), type: values.type, value: Number(values.value), productIds: values.productIds, startsAt: new Date(values.startsAt).toISOString(), endsAt: new Date(values.endsAt).toISOString(), enabled: values.enabled });
  }
  return <Form noValidate onSubmit={submit}>
    {submitError && <Alert variant="danger">{submitError}</Alert>}
    <fieldset disabled={busy}>
      <FormField label="Tên chương trình *" name="name" value={values.name} maxLength={120} onChange={change} error={errors.name} placeholder="Ví dụ: Tuần lễ ăn xanh" />
      <Row><Col md={6}><Form.Group className="mb-3" controlId="promotion-type"><Form.Label>Hình thức giảm *</Form.Label><Form.Select name="type" value={values.type} onChange={change}><option value="percentage">Giảm theo phần trăm</option><option value="fixed">Giảm theo số tiền</option></Form.Select></Form.Group></Col><Col md={6}><FormField label={values.type === 'percentage' ? 'Mức giảm (%) *' : 'Mức giảm (VNĐ) *'} name="value" type="number" min="0" step={values.type === 'percentage' ? '0.01' : '1'} max={values.type === 'percentage' ? '100' : undefined} value={values.value} onChange={change} error={errors.value} /></Col></Row>
      <Row><Col md={6}><FormField label="Bắt đầu *" name="startsAt" type="datetime-local" value={values.startsAt} onChange={change} error={errors.startsAt} /></Col><Col md={6}><FormField label="Kết thúc *" name="endsAt" type="datetime-local" value={values.endsAt} onChange={change} error={errors.endsAt} /></Col></Row>
      <p className="small text-muted">Thời gian theo múi giờ của thiết bị. Chương trình đã hết hạn cần sửa thời gian để áp dụng lại.</p>
      <fieldset className="mb-3"><legend className="fs-6">Sản phẩm áp dụng * ({values.productIds.length} đã chọn)</legend>
        <div className="manager-products-picker">{products.length ? products.map(product => <Form.Check className="mb-2" key={product.id} id={`promotion-product-${product.id}`} label={`${product.name} · ${money(product.price)} · ${quantityLabel(product.quantity)}`} checked={values.productIds.includes(product.id)} onChange={event => { setValues(current => ({ ...current, productIds: event.target.checked ? [...current.productIds, product.id] : current.productIds.filter(id => id !== product.id) })); setErrors(current => ({ ...current, productIds: '' })); }} />) : <span className="text-muted">Chưa có sản phẩm. Hãy thêm sản phẩm trước.</span>}</div>
        {errors.productIds && <div className="text-danger small mt-1" role="alert">{errors.productIds}</div>}
      </fieldset>
      <Form.Check type="switch" id="promotion-enabled" name="enabled" label="Bật chương trình theo lịch đã chọn" checked={values.enabled} onChange={change} />
      <div className="d-flex justify-content-end gap-2 mt-4"><Button variant="outline-secondary" onClick={onCancel}>Hủy</Button><Button type="submit" disabled={!products.length}>{busy ? 'Đang lưu...' : promotion ? 'Lưu thay đổi' : 'Tạo khuyến mãi'}</Button></div>
    </fieldset>
  </Form>;
}
