import type z from 'zod/v4';

export const buildPagination = (query?: { page?: number; limit?: number }) => {
  const page = Number(query?.page ?? 1);
  const limit = Number(query?.limit ?? 10);

  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;

  const offset = (safePage - 1) * safeLimit;

  return { offset, page: safePage, limit: safeLimit };
};

export const buildSort = (query: { sortKey: string; sortOrder: string }) => {
  const { sortKey, sortOrder } = query;
  return { [sortKey]: sortOrder };
};

const calculatePages = (total: number, limit: number) => Math.ceil(total / limit);

export const buildPaginationResponse = (
  records: unknown,
  page: number,
  limit: number,
  total: number
) => ({
  records,
  pagination: {
    currentPage: page,
    totalPages: calculatePages(total, limit),
    totalCount: total,
  },
});

export const buildStatusValidator = (
  ctx: z.RefinementCtx<string>,
  enumValues: Record<string, number>
) => {
  if (!ctx.value) return;
  const numbers = ctx.value.split(',').map(number => Number.parseInt(number, 10));
  if (!numbers.every(number => Object.values(enumValues).includes(number))) {
    ctx.issues.push({
      code: 'custom',
      message: 'Invalid status',
      path: ['status'],
      input: ctx.value,
    });
  }
};
