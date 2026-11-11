import assert from 'node:assert/strict';
import test from 'node:test';
import { paginateItems } from './useManagerPagination.js';

test('shows five items per page after filtering', () => {
  const filtered = Array.from({ length: 47 }, (_, index) => index + 1).filter(number => number % 2 === 1);
  const secondPage = paginateItems(filtered, 2);

  assert.deepEqual(secondPage.items, [11, 13, 15, 17, 19]);
  assert.deepEqual([secondPage.start, secondPage.end, secondPage.total, secondPage.totalPages], [6, 10, 24, 5]);
});

test('clamps the page when the list shrinks or is empty', () => {
  const lastPage = paginateItems(Array.from({ length: 11 }, (_, index) => index), 4);
  assert.deepEqual([lastPage.page, lastPage.start, lastPage.end, lastPage.items], [3, 11, 11, [10]]);

  const empty = paginateItems([], 3);
  assert.deepEqual([empty.page, empty.start, empty.end, empty.totalPages, empty.items], [1, 0, 0, 1, []]);
});

test('keeps exactly five items on one page', () => {
  const firstPage = paginateItems(Array.from({ length: 5 }, (_, index) => index), 1);
  assert.equal(firstPage.totalPages, 1);
  assert.equal(firstPage.items.length, 5);
});
