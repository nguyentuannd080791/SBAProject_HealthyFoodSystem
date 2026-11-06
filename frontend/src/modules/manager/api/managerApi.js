import { productSeed, promotionSeed } from '../data/seed.js';
import { validateProduct, validatePromotion } from '../validation/validators.js';
import { parseQuantity, validQuantity } from '../utils/productQuantity.js';

const keys = { products: 'hf_manager_products_v2', promotions: 'hf_manager_promotions_v1' };
const legacyProductsKey = 'hf_manager_products_v1';
const seeds = { products: productSeed, promotions: promotionSeed };
export const managerDataEvent = 'hf-manager-data';

function validateStoredData(collection, data, legacy = false) {
  if (!Array.isArray(data) || data.some(item => !item || typeof item.id !== 'string' || typeof item.name !== 'string'
    || (collection === 'products' && (typeof item.category !== 'string' || typeof item.description !== 'string' || typeof item.image !== 'string' || !Number.isFinite(item.price)
      || (legacy ? typeof item.isAvailable !== 'boolean' : !(validQuantity(item.quantity) || (item.quantity === null && item.quantityNeedsReview === true)))))
    || (collection === 'promotions' && (!Array.isArray(item.productIds) || !item.productIds.every(id => typeof id === 'string') || !['fixed', 'percentage'].includes(item.type) || !Number.isFinite(item.value) || typeof item.enabled !== 'boolean' || !Number.isFinite(Date.parse(item.startsAt)) || !Number.isFinite(Date.parse(item.endsAt)))))) {
    throw new Error('Dữ liệu lưu trên trình duyệt không hợp lệ.');
  }
}

function read(collection) {
  if (!Object.hasOwn(keys, collection)) throw new Error('Loại dữ liệu không hợp lệ.');
  const raw = localStorage.getItem(keys[collection]);
  if (raw === null) {
    const legacy = collection === 'products' ? localStorage.getItem(legacyProductsKey) : null;
    let data = structuredClone(seeds[collection]);
    if (legacy !== null) {
      const previous = JSON.parse(legacy);
      validateStoredData(collection, previous, true);
      // A boolean cannot tell us how many units exist. Keep v1 as a backup.
      data = previous.map(({ isAvailable: _isAvailable, ...product }) => ({
        ...product, quantity: null, quantityNeedsReview: true,
      }));
    }
    validateStoredData(collection, data);
    localStorage.setItem(keys[collection], JSON.stringify(data));
    return data;
  }
  const data = JSON.parse(raw);
  validateStoredData(collection, data);
  return data;
}

function write(collection, data) {
  localStorage.setItem(keys[collection], JSON.stringify(data));
  window.dispatchEvent(new Event(managerDataEvent));
}

async function attempt(action) {
  try {
    return { data: action() };
  } catch (error) {
    return { error: error.name === 'QuotaExceededError'
      ? 'Bộ nhớ trình duyệt đã đầy. Hãy dùng ảnh nhỏ hơn hoặc URL ảnh.'
      : error instanceof SyntaxError ? 'Không đọc được dữ liệu đã lưu trên trình duyệt.'
        : error.message || 'Không thể lưu dữ liệu. Vui lòng thử lại.' };
  }
}

export const managerApi = {
  list: collection => attempt(() => read(collection)),
  save: (collection, values, id) => attempt(() => {
    const errors = collection === 'products' ? validateProduct(values) : validatePromotion(values, read('products'));
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
    const data = read(collection);
    if (id && !data.some(item => item.id === id)) throw new Error('Không tìm thấy dữ liệu cần sửa.');
    const fields = collection === 'products'
      ? { name: values.name.trim(), category: values.category, description: values.description.trim(),
        price: Number(values.price), image: values.image.trim(), quantity: parseQuantity(values.quantity) }
      : values;
    const record = { ...fields, id: id || crypto.randomUUID(), updatedAt: new Date().toISOString() };
    write(collection, id ? data.map(item => item.id === id ? record : item) : [...data, record]);
    return record;
  }),
  setFlag: (collection, id, field, value) => attempt(() => {
    if (collection !== 'promotions' || field !== 'enabled' || typeof value !== 'boolean') {
      throw new Error('Hãy chỉnh sửa sản phẩm để cập nhật số lượng có thể bán.');
    }
    const data = read(collection);
    const record = data.find(item => item.id === id);
    if (!record) throw new Error('Không tìm thấy dữ liệu cần cập nhật.');
    const updated = { ...record, [field]: value, updatedAt: new Date().toISOString() };
    write(collection, data.map(item => item.id === id ? updated : item));
    return updated;
  }),
};
