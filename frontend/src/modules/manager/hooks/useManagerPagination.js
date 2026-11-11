import { useCallback, useEffect, useState } from 'react';

export const MANAGER_PAGE_SIZE = 5;

export function paginateItems(items, requestedPage, pageSize = MANAGER_PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const offset = (page - 1) * pageSize;

  return {
    items: items.slice(offset, offset + pageSize),
    page,
    totalPages,
    total,
    start: total ? offset + 1 : 0,
    end: Math.min(offset + pageSize, total),
  };
}

export function useManagerPagination(items) {
  const [requestedPage, setPage] = useState(1);
  const pagination = paginateItems(items, requestedPage);
  const resetPage = useCallback(() => setPage(1), []);

  useEffect(() => {
    setPage(current => Math.min(current, pagination.totalPages));
  }, [pagination.totalPages]);

  return { ...pagination, setPage, resetPage };
}
