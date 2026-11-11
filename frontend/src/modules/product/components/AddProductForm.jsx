import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormField } from '../../../shared/components/FormField';
import { CheckIcon, ImageIcon, LeafIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from '../../../shared/components/Icons';
import { ProductImage } from './ProductImage';
import { IngredientSearchField } from './IngredientSearchField';
import { httpClient } from '../../../shared/api/httpClient';
import { ingredientApi } from '../../ingredient/api/ingredientApi';
import { productApi } from '../api/productApi';
import { compatibleUnitOptions, inputUnit, quantityInputStep, toIngredientUnit } from '../../ingredient/utils/unitConversion';
import { validateProduct } from '../validators/productValidation';

const empty = {
  name: '', categoryId: '', description: '', price: '',
  status: 'AVAILABLE', ingredientLines: [],
  caloriesKcal: '', proteinG: '', carbohydrateG: '', fatG: '',
  fiberG: '', sugarG: '', sodiumMg: '', potassiumMg: '', imageFile: null,
};

let nextRecipeLineKey = 0;

function RequiredLabel({ children }) {
  return <>{children} <span className="manager-required">*</span></>;
}

function initialValues(product) {
  if (!product) return { ...empty };
  return {
    ...Object.fromEntries(
      Object.keys(empty).filter(key => !['ingredientLines', 'imageFile'].includes(key))
        .map(key => [key, product[key] == null ? '' : String(product[key])]),
    ),
    imageFile: null,
    ingredientLines: (product.ingredientLines || []).map(line => ({
      clientKey: ++nextRecipeLineKey,
      ingredientId: String(line.ingredientId),
      requiredQuantity: line.requiredQuantity == null ? '' : String(line.requiredQuantity),
      unit: inputUnit(line.unit),
    })),
  };
}

export function AddProductForm({ categories, onSave, busy, submitError, serverErrors, product }) {
  const [values, setValues] = useState(() => initialValues(product));
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [editedAfterServerError, setEditedAfterServerError] = useState({});
  const [preview, setPreview] = useState('');
  const recipeLinesRef = useRef(null);
  const focusNewLineRef = useRef(false);

  useLayoutEffect(() => {
    if (!focusNewLineRef.current) return;
    focusNewLineRef.current = false;
    const list = recipeLinesRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
      list.lastElementChild?.querySelector('[role="combobox"]')?.focus();
    }
  }, [values.ingredientLines.length]);

  useEffect(() => {
    let active = true;
    Promise.all([ingredientApi.list(), productApi.list()]).then(([ingredientResult, productResult]) => {
      if (!active) return;
      setIngredients(ingredientResult.data || []);
      setProducts(productResult.data || []);
      setLoadError(ingredientResult.error || productResult.error || '');
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!values.imageFile) { setPreview(''); return; }
    const url = URL.createObjectURL(values.imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [values.imageFile]);

  useEffect(() => { setEditedAfterServerError({}); }, [serverErrors]);

  function change(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setTouched(current => ({ ...current, [name]: true }));
    setEditedAfterServerError(current => ({ ...current, [name]: true }));
  }

  function changeLine(index, field, value) {
    setValues(current => ({
      ...current,
      ingredientLines: current.ingredientLines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line),
    }));
    setEditedAfterServerError(current => ({ ...current, ingredientLines: true }));
  }

  function submit(event) {
    event.preventDefault();
    const found = validateProduct(values, ingredients, products, product?.id);
    setSubmitted(true);
    if (Object.keys(found).length || busy) return;
    onSave({ ...values, name: values.name.trim() });
  }

  const liveErrors = validateProduct(values, ingredients, products, product?.id);
  const errorFor = name => ((submitted || touched[name]) && liveErrors[name]) ||
    (!editedAfterServerError[name] && serverErrors?.[name]) || '';
  const currentImage = product?.imageUrl
    ? new URL(product.imageUrl, httpClient.defaults.baseURL).href : '';
  const selectedIds = new Set(values.ingredientLines.map(line => String(line.ingredientId)));
  const available = values.ingredientLines.length > 0
    ? Math.min(...values.ingredientLines.map(line => {
      const item = ingredients.find(ingredient => String(ingredient.id) === String(line.ingredientId));
      const required = Math.round(toIngredientUnit(
        line.requiredQuantity, line.unit, item?.unit) * 1000);
      return item && required > 0
        ? Math.floor(Math.round(Number(item.stockQuantity) * 1000) / required) : 0;
    })) : 0;

  return <Form className="manager-product-form" noValidate onSubmit={submit} onBlurCapture={event => {
    const { name, value } = event.target;
    if (!name) return;
    if (name === 'ingredientLines' && value &&
      values.ingredientLines.some(line => !line.ingredientId || !line.requiredQuantity)) return;
    setTouched(current => ({ ...current, [name]: true }));
  }}>
    {(submitError || loadError) && <Alert variant="danger">{submitError || loadError}</Alert>}
    <fieldset disabled={busy}>
      <Row className="g-3 align-items-stretch manager-product-columns">
        <Col lg={7}>
          <Card className="manager-product-card manager-product-details">
            <Card.Header><span className="manager-card-icon"><ShoppingBagIcon size={21} /></span><h3>Thông tin sản phẩm</h3></Card.Header>
            <Card.Body>
            <FormField label={<RequiredLabel>Tên sản phẩm</RequiredLabel>} name="name" value={values.name}
              onChange={change} error={errorFor('name')} maxLength={150} />
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><RequiredLabel>Danh mục</RequiredLabel></Form.Label>
                  <Form.Select name="categoryId" value={values.categoryId} onChange={change}
                    isInvalid={Boolean(errorFor('categoryId'))}>
                    <option value="">Chọn danh mục</option>
                    {categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errorFor('categoryId')}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <FormField label={<RequiredLabel>Giá bán (VNĐ)</RequiredLabel>} name="price" type="number"
                  min="1" step="1" value={values.price} onChange={change} error={errorFor('price')} />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label><RequiredLabel>Trạng thái bán</RequiredLabel></Form.Label>
              <Form.Select name="status" value={values.status} onChange={change}
                isInvalid={Boolean(errorFor('status'))}>
                <option value="AVAILABLE">Đang bán</option>
                <option value="UNAVAILABLE">Ngừng bán</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errorFor('status')}</Form.Control.Feedback>
            </Form.Group>
            <FormField label="Mô tả" name="description" as="textarea" rows={3}
              value={values.description} onChange={change} />
            <h4 className="manager-nutrition-heading"><LeafIcon size={22} /> Dinh dưỡng trên một phần</h4>
            <Row>{[
              ['caloriesKcal', 'Calories (kcal)', '1', true],
              ['proteinG', 'Protein (g)', '0.1', true],
              ['carbohydrateG', 'Carbohydrate (g)', '0.1', true],
              ['fatG', 'Chất béo (g)', '0.1', true],
              ['fiberG', 'Chất xơ (g)', '0.1'],
              ['sugarG', 'Đường (g)', '0.1'],
              ['sodiumMg', 'Natri (mg)', '0.1'],
              ['potassiumMg', 'Kali (mg)', '0.1'],
            ].map(([name, label, step, required]) =>
              <Col md={6} key={name}>
                <FormField label={required ? <RequiredLabel>{label}</RequiredLabel> : label}
                  name={name} type="number" min="0" step={step}
                  value={values[name]} onChange={change} error={errorFor(name)} />
              </Col>)}</Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="manager-product-card manager-product-image-card">
            <Card.Header><span className="manager-card-icon"><ImageIcon size={21} /></span><h3>Hình ảnh sản phẩm</h3></Card.Header>
            <Card.Body>
            <ProductImage src={preview || currentImage} name={values.name || 'Sản phẩm'} large />
            <Form.Group className="manager-image-upload mt-3">
              <Form.Control id="product-image-file" className="manager-image-file-input"
                name="imageFile" type="file" accept="image/jpeg,image/png"
                aria-describedby={`product-image-help${errorFor('imageFile') ? ' product-image-error' : ''}`}
                onChange={event => {
                  setValues(current => ({ ...current, imageFile: event.target.files?.[0] || null }));
                  setTouched(current => ({ ...current, imageFile: true }));
                  setEditedAfterServerError(current => ({ ...current, imageFile: true }));
                }} isInvalid={Boolean(errorFor('imageFile'))} />
              <label htmlFor="product-image-file"
                className={`manager-image-upload-button${errorFor('imageFile') ? ' is-invalid' : ''}`}>
                <PlusIcon size={17} /> Chọn tệp
              </label>
              {errorFor('imageFile') && <div id="product-image-error" className="invalid-feedback d-block" role="alert">{errorFor('imageFile')}</div>}
              <Form.Text id="product-image-help" muted>JPEG hoặc PNG, tối đa 5 MB.</Form.Text>
            </Form.Group>
            </Card.Body>
          </Card>
          <Card className="manager-product-card manager-product-recipe mt-2">
            <Card.Header><span className="manager-card-icon"><LeafIcon size={21} /></span><h3>Công thức cho 1 combo</h3></Card.Header>
            <Card.Body>
            <p className="manager-recipe-hint">Định lượng các thành phần cho một combo nguyên liệu.</p>
            <div className="manager-recipe-toolbar">
              <Button size="sm" variant="success" type="button"
                onClick={() => {
                  focusNewLineRef.current = true;
                  setValues(current => ({
                    ...current,
                    ingredientLines: [...current.ingredientLines, {
                      clientKey: ++nextRecipeLineKey, ingredientId: '', requiredQuantity: '', unit: '',
                    }],
                  }));
                  setTouched(current => ({ ...current, ingredientLines: false }));
                  setEditedAfterServerError(current => ({ ...current, ingredientLines: true }));
                }}><PlusIcon size={17} /> Thêm nguyên liệu</Button>
            </div>
            {errorFor('ingredientLines') && <Alert variant="danger" className="py-2">
              {errorFor('ingredientLines')}
            </Alert>}
            {!values.ingredientLines.length && <p className="small text-secondary mb-3">
              Thêm ít nhất một nguyên liệu cho combo.
            </p>}
            <div ref={recipeLinesRef} className="manager-recipe-lines" role="region" aria-label="Danh sách nguyên liệu trong công thức" tabIndex={0}>
            {values.ingredientLines.map((line, index) => {
              const item = ingredients.find(ingredient =>
                String(ingredient.id) === String(line.ingredientId));
              return <div className="manager-recipe-line" key={line.clientKey}>
                <div className="d-flex gap-2">
                  <IngredientSearchField index={index} ingredients={ingredients} selected={item}
                    selectedIds={selectedIds}
                    onSelect={selected => {
                      setValues(current => ({ ...current, ingredientLines: current.ingredientLines.map((entry, i) =>
                        i === index && String(entry.ingredientId) !== String(selected.id)
                          ? { ...entry, ingredientId: String(selected.id), requiredQuantity: '', unit: inputUnit(selected.unit) }
                          : entry) }));
                      setEditedAfterServerError(current => ({ ...current, ingredientLines: true }));
                    }}
                    onClear={() => {
                      setValues(current => ({ ...current, ingredientLines: current.ingredientLines.map((entry, i) =>
                        i === index ? { ...entry, ingredientId: '', requiredQuantity: '', unit: '' } : entry) }));
                      setEditedAfterServerError(current => ({ ...current, ingredientLines: true }));
                    }} />
                  <Button variant="outline-danger" size="sm" type="button"
                    onClick={() => {
                      setValues(current => ({
                        ...current,
                        ingredientLines: current.ingredientLines.filter((_, i) => i !== index),
                      }));
                      setTouched(current => ({ ...current, ingredientLines: false }));
                      setEditedAfterServerError(current => ({ ...current, ingredientLines: true }));
                    }}><TrashIcon size={16} /> Xóa</Button>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Form.Control name="ingredientLines" aria-label={`Định lượng ${index + 1}`}
                    type="number" min={quantityInputStep(line.unit, item?.unit)}
                    step={quantityInputStep(line.unit, item?.unit)}
                    placeholder="Lượng cần cho 1 combo" value={line.requiredQuantity}
                    onChange={event => changeLine(index, 'requiredQuantity', event.target.value)} />
                  {item && compatibleUnitOptions(item.unit).length > 1
                    ? <Form.Select name="ingredientLines" aria-label={`Đơn vị định lượng ${index + 1}`}
                        style={{ maxWidth: 90 }} value={line.unit || inputUnit(item.unit)}
                        onChange={event => changeLine(index, 'unit', event.target.value)}>
                        {compatibleUnitOptions(item.unit).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                      </Form.Select>
                    : <span className="text-nowrap">{item?.unit || '—'}</span>}
                </div>
                {item && <div className="small text-secondary mt-2">
                  Tồn kho hiện tại: {item.stockQuantity} {item.unit}
                </div>}
              </div>;
            })}
            </div>
            <Alert variant={available > 0 ? 'success' : 'warning'} className="mb-0 mt-3">
              Số lượng có thể bán (ước tính): <strong>{Number.isFinite(available) ? available : 0} combo</strong>
            </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="manager-product-actions">
        <Button as={Link} to="/manager/products" variant="outline-secondary" type="button">Hủy</Button>
        <Button type="submit" disabled={busy}>
          {!busy && <CheckIcon size={18} className="me-2" />}
          {busy ? 'Đang lưu...' : product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        </Button>
      </div>
    </fieldset>
  </Form>;
}
