import { productSeed, promotionSeed } from '../data/seed.js';
import { validateProduct, validatePromotion } from '../validation/validators.js';

const keys = { products: 'hf_manager_products_v1', promotions: 'hf_manager_promotions_v1' };
const seeds = { products: productSeed, promotions: promotionSeed };
export const managerDataEvent = 'hf-manager-data';

function read(collection) {
  const raw = localStorage.getItem(keys[collection]);
  if (raw === null) {
    localStorage.setItem(keys[collection], JSON.stringify(seeds[collection]));
    return structuredClone(seeds[collection]);
  }
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || data.some(item => !item || typeof item.id !== 'string' || typeof item.name !== 'string'
    || (collection === 'products' && (typeof item.category !== 'string' || typeof item.description !== 'string' || typeof item.image !== 'string' || !Number.isFinite(item.price) || typeof item.isAvailable !== 'boolean'))
    || (collection === 'promotions' && (!Array.isArray(item.productIds) || !item.productIds.every(id => typeof id === 'string') || !['fixed', 'percentage'].includes(item.type) || !Number.isFinite(item.value) || typeof item.enabled !== 'boolean' || !Number.isFinite(Date.parse(item.startsAt)) || !Number.isFinite(Date.parse(item.endsAt)))))) {
    throw new Error('Dữ liệu lưu trên trình duyệt không hợp lệ.');
  }
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
    const record = { ...values, id: id || crypto.randomUUID(), updatedAt: new Date().toISOString() };
    write(collection, id ? data.map(item => item.id === id ? record : item) : [...data, record]);
    return record;
  }),
  setFlag: (collection, id, field, value) => attempt(() => {
    const data = read(collection);
    const record = data.find(item => item.id === id);
    if (!record) throw new Error('Không tìm thấy dữ liệu cần cập nhật.');
    const updated = { ...record, [field]: value, updatedAt: new Date().toISOString() };
    write(collection, data.map(item => item.id === id ? updated : item));
    return updated;
  }),
};
