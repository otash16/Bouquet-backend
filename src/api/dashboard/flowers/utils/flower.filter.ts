import type { Prisma } from '../../../shared/types/prisma.types.ts';

interface FlowerFilterParams {
  search?: string;
  shopId?: string;
  categoryId?: string;
  status?: number;
  adminShopId?: string | null;
}

export const buildFlowerFilter = (params: FlowerFilterParams) => {
  const filter: Prisma.FlowerWhereInput = {
    deletedAt: null,
  };

  // Shop admin faqat o'z do'konining gullarini ko'radi
  if (params.adminShopId) {
    filter.shopId = params.adminShopId;
  } else if (params.shopId) {
    filter.shopId = params.shopId;
  }

  if (params.categoryId) {
    filter.categoryId = params.categoryId;
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
