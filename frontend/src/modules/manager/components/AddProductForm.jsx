import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormField } from '../../../shared/components/FormField';
import { ProductImage } from './ProductImage';

const initial = { name: '', categoryId: '', description: '', price: '', ingredientsText: '',
  caloriesKcal: '', proteinG: '', carbohydrateG: '', fatG: '', fiberG: '', sugarG: '', sodiumMg: '', imageFile: null };
const optional = ['description', 'ingredientsText', 'fiberG', 'sugarG', 'sodiumMg'];

function validate(values) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length > 150) errors.name = 'Tên sản phẩm cần từ 1 đến 150 ký tự.';
  if (!Number.isInteger(Number(values.categoryId)) || Number(values.categoryId) <= 0) errors.categoryId = 'Chọn danh mục.';
  if (!/^\d+$/.test(values.price) || Number(values.price) <= 0 || Number(values.price) > 999999999999) errors.price = 'Giá phải là số nguyên dương tối đa 12 chữ số.';
  if (!/^\d+$/.test(values.caloriesKcal) || Number(values.caloriesKcal) > 2147483647) errors.caloriesKcal = 'Calories phải là số nguyên không âm.';
  for (const field of ['proteinG', 'carbohydrateG', 'fatG', 'fiberG', 'sugarG', 'sodiumMg']) {
    if (optional.includes(field) && values[field] === '') continue;
    const limit = field === 'sodiumMg' ? 7 : 5;
    if (!new RegExp(`^\\d{1,${limit}}(\\.\\d)?$`).test(values[field])) errors[field] = 'Nhập số không âm, tối đa 1 chữ số thập phân.';
  }
  if (values.imageFile && (!['image/jpeg', 'image/png'].includes(values.imageFile.type) || values.imageFile.size > 5 * 1024 * 1024)) {
    errors.imageFile = 'Chọn ảnh JPEG hoặc PNG tối đa 5 MB.';
  }
  return errors;
}

export function AddProductForm({ categories, onSave, busy, submitError, serverErrors }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!values.imageFile) { setPreview(''); return; }
    const url = URL.createObjectURL(values.imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [values.imageFile]);
  function change(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: '' }));
  }
  function submit(event) {
    event.preventDefault();
    if (busy) return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSave({ ...values, name: values.name.trim(), categoryId: values.categoryId });
  }
  const errorFor = name => errors[name] || serverErrors[name];
  return <Form noValidate onSubmit={submit}>
    {submitError && <Alert variant="danger">{submitError}</Alert>}
    <fieldset disabled={busy}>
      <Row className="g-4"><Col lg={8}><Card body><h2 className="h5 mb-4">Thông tin sản phẩm</h2>
        <FormField label="Tên sản phẩm *" name="name" value={values.name} onChange={change} error={errorFor('name')} maxLength={150} />
        <Row><Col md={6}><Form.Group className="mb-3" controlId="add-category"><Form.Label>Danh mục *</Form.Label>
          <Form.Select name="categoryId" value={values.categoryId} onChange={change} isInvalid={!!errorFor('categoryId')}>
            <option value="">Chọn danh mục</option>{categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </Form.Select><Form.Control.Feedback type="invalid">{errorFor('categoryId')}</Form.Control.Feedback>
        </Form.Group></Col><Col md={6}><FormField label="Giá bán (VNĐ) *" name="price" type="number" min="1" step="1" value={values.price} onChange={change} error={errorFor('price')} /></Col></Row>
        <FormField label="Mô tả" name="description" as="textarea" rows={3} value={values.description} onChange={change} error={errorFor('description')} />
        <FormField label="Thành phần" name="ingredientsText" as="textarea" rows={2} value={values.ingredientsText} onChange={change} error={errorFor('ingredientsText')} />
        <h3 className="h6 mt-3">Dinh dưỡng trên một phần</h3><Row>
          {[
            ['caloriesKcal', 'Calories (kcal) *', '1'], ['proteinG', 'Protein (g) *', '0.1'],
            ['carbohydrateG', 'Carbohydrate (g) *', '0.1'], ['fatG', 'Chất béo (g) *', '0.1'],
            ['fiberG', 'Chất xơ (g)', '0.1'], ['sugarG', 'Đường (g)', '0.1'], ['sodiumMg', 'Natri (mg)', '0.1'],
          ].map(([name, label, step]) => <Col md={6} key={name}><FormField label={label} name={name} type="number" min="0" step={step} value={values[name]} onChange={change} error={errorFor(name)} /></Col>)}
        </Row>
      </Card></Col><Col lg={4}><Card body><h2 className="h5 mb-3">Hình ảnh</h2>
        <ProductImage src={preview} name={values.name || 'Sản phẩm'} large />
        <Form.Group className="mt-3" controlId="add-image"><Form.Label>Chọn ảnh từ máy</Form.Label>
          <Form.Control type="file" accept="image/jpeg,image/png" onChange={event => { setValues(current => ({ ...current, imageFile: event.target.files?.[0] || null })); setErrors(current => ({ ...current, imageFile: '' })); }} isInvalid={!!errorFor('imageFile')} />
          <Form.Control.Feedback type="invalid">{errorFor('imageFile')}</Form.Control.Feedback>
          <Form.Text muted>JPEG hoặc PNG, tối đa 5 MB. Có thể không chọn ảnh.</Form.Text>
        </Form.Group>{values.imageFile && <div className="small mt-2">{values.imageFile.name}</div>}
      </Card></Col></Row>
      <div className="d-flex justify-content-end mt-4"><Button type="submit" disabled={busy}>{busy ? 'Đang lưu...' : 'Thêm sản phẩm'}</Button></div>
    </fieldset>
  </Form>;
}
