import { useCallback, useEffect, useState } from 'react';
import { managerApi, managerDataEvent } from '../api/managerApi';

export function useManagerData(collection) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const reload = useCallback(async () => {
    const result = await managerApi.list(collection);
    setError(result.error || '');
    if (result.data) setItems(result.data);
    setLoading(false);
  }, [collection]);
  useEffect(() => {
    reload();
    window.addEventListener(managerDataEvent, reload);
    window.addEventListener('storage', reload);
    return () => {
      window.removeEventListener(managerDataEvent, reload);
      window.removeEventListener('storage', reload);
    };
  }, [reload]);
  async function run(action) {
    setBusy(true);
    const result = await action();
    if (!result.error) await reload();
    setBusy(false);
    return result;
  }
  return { items, loading, error, busy, reload,
    save: (values, id) => run(() => managerApi.save(collection, values, id)),
    setFlag: (id, field, value) => run(() => managerApi.setFlag(collection, id, field, value)),
  };
}
