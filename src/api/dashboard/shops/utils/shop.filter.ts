import type { Prisma } from '../../../shared/types/prisma.types.ts';

interface ShopFilterParams {
  search?: string;
  status?: number;
  shopId?: string | null;
}

export const buildShopFilter = (params: ShopFilterParams) => {
  const filter: Prisma.ShopWhereInput = {
    deletedAt: null,
  };

  // Shop admin faqat o'z do'konini ko'radi
  if (params.shopId) {
    filter.id = params.shopId;
  }

  if (params.status !== undefined) {
    filter.status = params.status;
  }

  if (params.search) {
    filter.translations = {
      some: {
        name: { contains: params.search, mode: 'insensitive' },
      },
    };
  }

  return filter;
};
