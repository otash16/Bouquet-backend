import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { NotFoundError } from '../../../errors/index.ts';
import { buildPagination, buildPaginationResponse } from '../../../utilities/index.ts';
import type { Prisma } from '../../shared/types/prisma.types.ts';

interface GetFlowersParams {
  language?: string;
  shopId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export const getFlowers = async (params: GetFlowersParams) => {
  const language = params.language || 'uz';
  const { offset, limit, page } = buildPagination(params);

  const filter: Prisma.FlowerWhereInput = {
    status: 1,
    deletedAt: null,
    shop: { status: 1, deletedAt: null },
  };

  if (params.shopId) {
    filter.shopId = params.shopId;
  }

  if (params.categoryId) {
    filter.categoryId = params.categoryId;
  }

  const [flowers, total] = await Promise.all([
    db.flower.findMany({
      take: limit,
      skip: offset,
      where: filter,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        price: true,
        discountPrice: true,
        images: true,
        shopId: true,
        shop: {
          select: {
            slug: true,
            translations: { where: { language }, select: { name: true } },
          },
        },
        category: {
          select: {
            slug: true,
            translations: { where: { language }, select: { name: true } },
          },
        },
        translations: {
          where: { language },
          select: { name: true, description: true },
        },
        createdAt: true,
      },
    }),
    db.flower.count({ where: filter }),
  ]);

  const records = flowers.map(f => ({
    id: f.id,
    name: f.translations[0]?.name ?? '',
    description: f.translations[0]?.description ?? null,
    price: f.price,
    discountPrice: f.discountPrice,
    images: f.images,
    shopId: f.shopId,
    shopSlug: f.shop.slug,
    shopName: f.shop.translations[0]?.name ?? '',
    categorySlug: f.category?.slug ?? null,
    categoryName: f.category?.translations[0]?.name ?? null,
    createdAt: f.createdAt,
  }));

  return buildPaginationResponse(records, page, limit, total);
};

export const getFlowerById = async (id: string, language = 'uz') => {
  const flower = await db.flower.findUnique({
    where: { id, status: 1, deletedAt: null },
    select: {
      id: true,
      price: true,
      discountPrice: true,
      images: true,
      shopId: true,
      shop: {
        select: {
          slug: true,
          logo: true,
          phone: true,
          translations: { where: { language }, select: { name: true } },
        },
      },
      category: {
        select: {
          slug: true,
          translations: { where: { language }, select: { name: true } },
        },
      },
      translations: {
        where: { language },
        select: { name: true, description: true },
      },
      createdAt: true,
    },
  });

  if (!flower) {
    throw new NotFoundError(ErrorMessages.FlowerNotFound, ErrorCodes.FlowerNotFound);
  }

  return {
    id: flower.id,
    name: flower.translations[0]?.name ?? '',
    description: flower.translations[0]?.description ?? null,
    price: flower.price,
    discountPrice: flower.discountPrice,
    images: flower.images,
    shopId: flower.shopId,
    shopSlug: flower.shop.slug,
    shopLogo: flower.shop.logo,
    shopPhone: flower.shop.phone,
    shopName: flower.shop.translations[0]?.name ?? '',
    categorySlug: flower.category?.slug ?? null,
    categoryName: flower.category?.translations[0]?.name ?? null,
    createdAt: flower.createdAt,
  };
};
