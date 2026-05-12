import type { Prisma } from '../../../shared/types/prisma.types.ts';

export const buildCategoryFilter = (search?: string) => {
  const filter: Prisma.CategoryWhereInput = {
    deletedAt: null,
  };

  if (search) {
    filter.translations = {
      some: {
        name: { contains: search, mode: 'insensitive' },
      },
    };
  }

  return filter;
};
