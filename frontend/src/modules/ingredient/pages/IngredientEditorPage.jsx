import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { LeafIcon, PencilIcon, PlusIcon } from '../../../shared/components/Icons';
import { ingredientApi } from '../api/ingredientApi';
import { productApi } from '../../product/api/productApi';
import { validateIngredient } from '../validators/ingredientValidation';
import { ingredientUnits } from '../utils/unitConversion';

const empty = { name: '', unit: '', stockQuantity: '', warningQuantity: '', note: '' };

export function IngredientEditorPage() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(empty);
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([ingredientApi.list(), ingredientId
      ? ingredientApi.get(ingredientId) : Promise.resolve({ data: null }), ingredientId
      ? productApi.list() : Promise.resolve({ data: [] })]).then(([list, result, productList]) => {
      if (!active) return;
      setIngredients(list.data || []);
      setProducts(productList.data || []);
      if (result.data) { setValues(result.data); setOriginal(result.data); }
      setError(list.error || result.error || productList.error || '');
      setLoading(false);
    });
    return () => { active = false; };
  }, [ingredientId]);

  function change(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setTouched(current => ({ ...current, [name]: true }));
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(fieldErrors).length || busy) return;
    const name = values.name.trim();
    const unit = values.unit.trim();
    setBusy(true);
    setError('');
    const request = { name, unit, warningQuantity: values.warningQuantity, note: values.note || '' };
    if (!ingredientId) request.stockQuantity = values.stockQuantity;
    const result = ingredientId
      ? await ingredientApi.update(ingredientId, request)
      : await ingredientApi.create(request);
    setBusy(false);
    if (result.error) { setError(result.error); return; }
    navigate('/manager/ingredients');
  }

  const fieldErrors = validateIngredient(values, ingredients, ingredientId, original, products);
  const errorFor = name => submitted || touched[name] ? fieldErrors[name] : '';

  if (loading) return <Spinner animation="border" role="status" />;
  return <div>
    <nav className="manager-breadcrumb" aria-label="Đường dẫn">
      <Link to="/manager" aria-label="Trang quản lý"><LeafIcon size={18} /></Link>
      <span aria-hidden="true">›</span>
      <Link to="/manager/ingredients">Kho nguyên liệu</Link>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{ingredientId ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu'}</span>
    </nav>
    <div className="manager-product-title">
      <span>{ingredientId ? <PencilIcon size={27} /> : <PlusIcon size={27} />}</span>
      <div>
        <h2 className="h4 mb-0">{ingredientId ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu'}</h2>
        <p className="text-secondary small mb-0">Tên, đơn vị và số lượng được quản lý tại một nơi.</p>
      </div>
    </div>
    {error && <Alert variant="danger">{error}</Alert>}
    <div className="mx-auto" style={{ maxWidth: 820 }}>
      <Card body>
          <h3 className="h5 mb-4">Thông tin nguyên liệu</h3>
          <Form noValidate onSubmit={submit} onBlurCapture={event => {
            if (event.target.name) setTouched(current => ({ ...current, [event.target.name]: true }));
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Tên nguyên liệu *</Form.Label>
              <Form.Control name="name" required maxLength={150} value={values.name} onChange={change}
                isInvalid={Boolean(errorFor('name'))} />
              <Form.Control.Feedback type="invalid">{errorFor('name')}</Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đơn vị *</Form.Label>
                  <Form.Select name="unit" required value={values.unit} onChange={change}
                    isInvalid={Boolean(errorFor('unit'))}>
                    <option value="">Chọn đơn vị</option>
                    {ingredientId && values.unit && !ingredientUnits.includes(values.unit) &&
                      <option value={values.unit}>{values.unit} (đơn vị hiện tại)</option>}
                    {ingredientUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errorFor('unit')}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mức cảnh báo *</Form.Label>
                  <Form.Control name="warningQuantity" type="number" min="0" step="0.001" required
                    value={values.warningQuantity} onChange={change}
                    isInvalid={Boolean(errorFor('warningQuantity'))} />
                  <Form.Control.Feedback type="invalid">{errorFor('warningQuantity')}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            {ingredientId ? <p className="text-secondary mb-3">
              Tồn kho hiện tại: <strong>{original?.stockQuantity} {original?.unit}</strong>
            </p> : <Form.Group className="mb-3">
              <Form.Label>Tồn kho ban đầu *</Form.Label>
              <Form.Control name="stockQuantity" type="number" min="0" step="0.001" required
                value={values.stockQuantity} onChange={change}
                isInvalid={Boolean(errorFor('stockQuantity'))} />
              <Form.Control.Feedback type="invalid">{errorFor('stockQuantity')}</Form.Control.Feedback>
            </Form.Group>}
            <Form.Group className="mb-4">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control name="note" as="textarea" rows={3} maxLength={500}
                value={values.note || ''} onChange={change} isInvalid={Boolean(errorFor('note'))} />
              <Form.Control.Feedback type="invalid">{errorFor('note')}</Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button as={Link} to="/manager/ingredients" variant="outline-secondary">Hủy</Button>
              <Button type="submit" disabled={busy}>{busy ? 'Đang lưu...' : 'Lưu nguyên liệu'}</Button>
            </div>
          </Form>
      </Card>
    </div>
  </div>;
}
