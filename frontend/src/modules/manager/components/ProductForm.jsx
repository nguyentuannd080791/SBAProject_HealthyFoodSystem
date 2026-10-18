import { useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormField } from '../../../shared/components/FormField';
import { categories } from '../data/seed';
import { validateProduct, validImage } from '../validation/validators';
import { ProductImage } from './ProductImage';

const empty = { name: '', category: '', description: '', price: '', image: '', isAvailable: true };
export function ProductForm({ product, onSave, onCancel, busy, submitError }) {
  const [values, setValues] = useState(product || empty);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [reading, setReading] = useState(false);
  function change(event) {
    const { name, value, type, checked } = event.target;
    setValues(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors(current => ({ ...current, [name]: '' }));
  }
  async function chooseImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImageError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
      setImageError('Chọn ảnh JPG, PNG hoặc WebP tối đa 1 MB.');
      return;
    }
    setReading(true);
    try {
      const image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Không đọc được ảnh.'));
        reader.readAsDataURL(file);
      });
      await new Promise((resolve, reject) => {
        const preview = new Image();
        preview.onload = resolve;
        preview.onerror = () => reject(new Error('Tệp ảnh không hợp lệ hoặc đã bị hỏng.'));
        preview.src = image;
      });
      setValues(current => ({ ...current, image }));
      setErrors(current => ({ ...current, image: '' }));
    } catch (error) { setImageError(error.message); }
    finally { setReading(false); }
  }
  function submit(event) {
    event.preventDefault();
    const found = validateProduct(values);
    setErrors(found);
    if (Object.keys(found).length || reading) return;
    onSave({ name: values.name.trim(), category: values.category, description: values.description.trim(), price: Number(values.price), image: values.image.trim(), isAvailable: values.isAvailable });
  }
  return <Form noValidate onSubmit={submit}>
    {submitError && <Alert variant="danger">{submitError}</Alert>}
    <fieldset disabled={busy || reading}>
      <Row className="g-4">
        <Col lg={8}><Card body><h2 className="h5 mb-4">Thông tin sản phẩm</h2>
          <FormField label="Tên sản phẩm *" name="name" value={values.name} onChange={change} error={errors.name} maxLength={120} placeholder="Ví dụ: Salad ức gà sốt mè" />
          <Row><Col md={6}><Form.Group className="mb-3" controlId="product-category"><Form.Label>Danh mục *</Form.Label><Form.Select name="category" value={values.category} onChange={change} isInvalid={!!errors.category}><option value="">Chọn danh mục</option>{categories.map(category => <option key={category}>{category}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback></Form.Group></Col>
            <Col md={6}><FormField label="Giá bán (VNĐ) *" name="price" type="number" min="1" max="100000000" step="1" value={values.price} onChange={change} error={errors.price} /></Col></Row>
          <FormField label="Mô tả *" name="description" as="textarea" rows={5} maxLength={2000} value={values.description} onChange={change} error={errors.description} placeholder="Thành phần, hương vị và điểm nổi bật của món ăn..." />
          <div className="rounded border p-3"><Form.Check type="switch" id="product-availability" name="isAvailable" checked={values.isAvailable} onChange={change} label={values.isAvailable ? 'Còn hàng — sẵn sàng phục vụ' : 'Hết hàng — tạm ngừng nhận món'} /></div>
        </Card></Col>
        <Col lg={4}><Card body><h2 className="h5 mb-3">Hình ảnh</h2><ProductImage src={validImage(values.image.trim()) ? values.image.trim() : ''} name={values.name || 'Sản phẩm'} large />
          <div className="mt-3"><FormField label="URL hình ảnh" name="image" type="url" value={values.image.startsWith('data:') ? '' : values.image} onChange={change} error={errors.image} placeholder="https://..." hint="Có thể để trống để dùng ảnh đại diện mặc định." /></div>
          <Form.Group controlId="product-file"><Form.Label>Hoặc chọn ảnh từ máy</Form.Label><Form.Control type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} /><Form.Text muted>JPG, PNG, WebP · tối đa 1 MB. Ảnh được lưu cùng sản phẩm.</Form.Text></Form.Group>
          {imageError && <Alert className="mt-3" variant="danger">{imageError}</Alert>}
          {values.image && <Button variant="outline-secondary" className="mt-3" onClick={() => { setValues(current => ({ ...current, image: '' })); setImageError(''); }}>Bỏ ảnh</Button>}
        </Card></Col>
      </Row>
      <div className="d-flex justify-content-end gap-2 mt-4"><Button variant="outline-secondary" onClick={onCancel}>Hủy</Button><Button type="submit">{busy ? 'Đang lưu...' : reading ? 'Đang đọc ảnh...' : product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</Button></div>
    </fieldset>
  </Form>;
}
