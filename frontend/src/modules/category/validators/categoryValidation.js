export function validateCategoryName(value, categories, editingCategoryId = null) {
  const name = value.trim().replace(/\s+/g, ' ');
  if (!name || name.length > 100) {
    return { name, error: 'Tên danh mục cần từ 1 đến 100 ký tự.' };
  }
  const duplicate = categories.some(category => category.id !== editingCategoryId
    && category.name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'));
  return { name, error: duplicate ? 'Tên danh mục đã tồn tại.' : '' };
}
