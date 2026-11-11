import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Alert, Badge, Button, Card, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { RotateCcwIcon } from '../../../shared/components/Icons';
import { categoryApi } from '../api/categoryApi';
import { validateCategoryName } from '../validators/categoryValidation';
import { ManagerSummaryStats } from '../../manager/components/ManagerSummaryStats';
import { ManagerPagination } from '../../manager/components/ManagerPagination';
import { useManagerPagination } from '../../manager/hooks/useManagerPagination';

export function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsReady, setStatsReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    categoryApi.listAllForManager().then(result => {
      if (!active) return;
      setCategories(result.data || []);
      setStatsReady(Array.isArray(result.data));
      setLoadError(result.error || '');
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  function openForm(category = null) {
    setEditingCategory(category);
    setName(category?.name || '');
    setError('');
    setFieldError('');
    setNotice('');
    setShowForm(true);
  }

  async function save(event) {
    event.preventDefault();
    if (busy) return;
    const validation = validateCategoryName(name, categories, editingCategory?.id);
    if (validation.error) {
      setFieldError(validation.error);
      return;
    }
    setBusy(true);
    setError('');
    setFieldError('');
    const result = editingCategory
      ? await categoryApi.update(editingCategory.id, validation.name)
      : await categoryApi.create(validation.name);
    setBusy(false);
    if (result.error) {
      const nameError = result.validationErrors?.name || (result.error.startsWith('Tên danh mục') ? result.error : '');
      setFieldError(nameError);
      setError(nameError ? '' : result.error);
      return;
    }
    setCategories(current => (editingCategory
      ? current.map(category => category.id === result.data.id ? result.data : category)
      : [...current, result.data]).sort((a, b) => a.name.localeCompare(b.name, 'vi')));
    setShowForm(false);
    if (!editingCategory) {
      setSearch('');
      setStatusFilter('');
      resetPage();
    }
    setNotice(editingCategory ? 'Đã sửa danh mục.' : 'Đã thêm danh mục. Bạn có thể chọn danh mục này khi thêm sản phẩm.');
  }

  async function toggleActive(category) {
    if (busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    const result = await categoryApi.setActive(category.id, !category.isActive);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setCategories(current => current.map(item => item.id === result.data.id ? result.data : item));
    setNotice(category.isActive ? 'Đã ngừng hoạt động danh mục.' : 'Đã bật lại danh mục.');
  }

  const filtered = categories.filter(category =>
    category.name.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi'))
    && (!statusFilter || (statusFilter === 'active' ? category.isActive : !category.isActive)));
  const { items: pageItems, page, totalPages, start, end, total, setPage, resetPage } = useManagerPagination(filtered);

  return <>
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
      <div><h2 className="h4 mb-1">Danh mục sản phẩm</h2><p className="text-muted mb-0">Quản lý danh mục dùng cho sản phẩm và khuyến mại.</p></div>
      <Button onClick={() => openForm()} disabled={loading || !!loadError}>+ Thêm danh mục</Button>
    </div>
    <ManagerSummaryStats ready={statsReady} selected={statusFilter || (search ? null : '')}
      onSelect={value => { setSearch(''); setStatusFilter(value); resetPage(); }} stats={[
        ['Tổng danh mục', categories.length, ''],
        ['Đang hoạt động', categories.filter(category => category.isActive).length, 'active'],
        ['Ngừng hoạt động', categories.filter(category => !category.isActive).length, 'inactive'],
      ]} />
    {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}
    {loadError && <Alert variant="danger">{loadError}</Alert>}
    {error && !showForm && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
    <Card body>
      <div className="d-flex gap-3 mb-4 flex-wrap align-items-center">
        <Form.Control style={{ maxWidth: 360 }} aria-label="Tìm tên danh mục" placeholder="Tìm tên danh mục..." value={search} onChange={event => { setSearch(event.target.value); resetPage(); }} />
        <Form.Select style={{ maxWidth: 260 }} aria-label="Lọc trạng thái danh mục" value={statusFilter} onChange={event => { setStatusFilter(event.target.value); resetPage(); }}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </Form.Select>
        {(search || statusFilter) && (
          <Button variant="outline-secondary" size="sm" aria-label="Xóa bộ lọc" title="Xóa bộ lọc"
            onClick={() => { setSearch(''); setStatusFilter(''); resetPage(); }}>
            <RotateCcwIcon size={16} />
          </Button>
        )}
      </div>
      {loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải...</span></Spinner>
        : loadError ? null
          : !filtered.length ? <p className="text-muted mb-0 py-4 text-center">{categories.length ? 'Không tìm thấy danh mục phù hợp.' : 'Chưa có danh mục. Hãy thêm danh mục đầu tiên.'}</p>
          : <Table responsive hover className="align-middle mb-0">
            <thead><tr><th>Tên danh mục</th><th>Số sản phẩm</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>{pageItems.map(category => <tr key={category.id}>
              <td><strong>{category.name}</strong></td>
              <td><Link to={`/manager/products?categoryId=${category.id}`} aria-label={`Xem sản phẩm thuộc danh mục ${category.name}`}>{category.productCount ?? 0}</Link></td>
              <td><Badge bg={category.isActive ? 'success' : 'secondary'}>{category.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Badge></td>
              <td><div className="d-flex gap-2 flex-wrap"><Button size="sm" variant="outline-primary" disabled={busy} onClick={() => openForm(category)}>Sửa</Button>
                <Button size="sm" variant={category.isActive ? 'outline-secondary' : 'outline-success'} disabled={busy} onClick={() => toggleActive(category)}>{category.isActive ? 'Ngừng hoạt động' : 'Bật lại'}</Button></div></td>
            </tr>)}</tbody>
          </Table>}
      {!loading && !loadError && <ManagerPagination page={page} totalPages={totalPages} start={start} end={end} total={total} onPageChange={setPage} />}
    </Card>

    <Modal show={showForm} onHide={() => { if (!busy) setShowForm(false); }} centered backdrop={busy ? 'static' : true} keyboard={!busy}>
      <Form onSubmit={save} noValidate>
        <Modal.Header closeButton={!busy}><Modal.Title as="h2" className="h5">{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="categoryName">
            <Form.Label>Tên danh mục *</Form.Label>
            <Form.Control value={name} maxLength={100} required placeholder="Ví dụ: Đồ ăn nhẹ" isInvalid={!!fieldError} autoFocus disabled={busy}
              onChange={event => {
                const nextName = event.target.value;
                setName(nextName);
                setFieldError(validateCategoryName(nextName, categories, editingCategory?.id).error);
                setError('');
              }}
              onBlur={() => setFieldError(validateCategoryName(name, categories, editingCategory?.id).error)} />
            <Form.Control.Feedback type="invalid">{fieldError}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" onClick={() => setShowForm(false)} disabled={busy}>Hủy</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Đang lưu...' : editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục'}</Button></Modal.Footer>
      </Form>
    </Modal>
  </>;
}
