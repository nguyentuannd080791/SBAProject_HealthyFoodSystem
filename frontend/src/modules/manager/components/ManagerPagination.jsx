import { Pagination } from 'react-bootstrap';

export function ManagerPagination({ page, totalPages, start, end, total, onPageChange }) {
  if (totalPages <= 1) return null;

  const visiblePages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter(number => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b);

  return <nav className="manager-pagination" aria-label="Phân trang danh sách">
    <span className="text-muted small">{start}–{end} / {total}</span>
    <Pagination className="mb-0 flex-wrap justify-content-center">
      <Pagination.Prev disabled={page === 1} onClick={() => onPageChange(page - 1)}>Trước</Pagination.Prev>
      {visiblePages.map((number, index) => <FragmentPage key={number} number={number}
        gap={index > 0 && number - visiblePages[index - 1] > 1}
        active={number === page} onPageChange={onPageChange} />)}
      <Pagination.Next disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Sau</Pagination.Next>
    </Pagination>
  </nav>;
}

function FragmentPage({ number, gap, active, onPageChange }) {
  return <>
    {gap && <Pagination.Ellipsis disabled />}
    <Pagination.Item active={active} onClick={() => onPageChange(number)}>{number}</Pagination.Item>
  </>;
}
