import { useState } from 'react';

export function ProductImage({ src, name, large = false }) {
  const [failedSource, setFailedSource] = useState(null);
  return src && failedSource !== src
    ? <img className={large ? 'manager-image-preview' : 'manager-thumbnail'} src={src} alt={name} onError={() => setFailedSource(src)} />
    : <div className={`${large ? 'manager-image-preview' : 'manager-thumbnail'} manager-image-empty`} role="img" aria-label="Chưa có ảnh hoặc ảnh không tải được">{large ? 'Ảnh sản phẩm sẽ hiển thị tại đây' : '🥗'}</div>;
}
