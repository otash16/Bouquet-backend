import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { AdminRole } from '../../../enums/index.ts';
import { ForbiddenError, NotFoundError } from '../../../errors/index.ts';
import { buildPagination, buildPaginationResponse, buildSort } from '../../../utilities/index.ts';
import type { TCreateFlowerDto, TGetFlowersDto, TUpdateFlowerDto } from './utils/flower.dto.ts';
import { buildFlowerFilter } from './utils/flower.filter.ts';
import { flowerTransformer, flowersTransformer } from './utils/flower.transformer.ts';

const flowerSelect = {
  id: true,
  price: true,
  discountPrice: true,
  images: true,
  status: true,
  shopId: true,
  categoryId: true,
  shop: {
    select: { translations: { where: { language: 'uz' }, select: { name: true } } },
  },
  category: {
    select: { translations: { where: { language: 'uz' }, select: { name: true } } },
  },
  translations: {
    select: { language: true, name: true, description: true },
  },
  createdAt: true,
  updatedAt: true,
} as const;

export const getFlowers = async (
  query: TGetFlowersDto['query'],
  admin: { role: number; shopId: string | null }
) => {
  const sort = buildSort(query);
  const { offset, limit, page } = buildPagination(query);
  const filter = buildFlowerFilter({
    search: query.search,
    shopId: query.shopId,
    categoryId: query.categoryId,
    status: query.status,
    adminShopId: admin.role === AdminRole.ShopAdmin ? admin.shopId : undefined,
  });

  const [flowers, total] = await Promise.all([
    db.flower.findMany({
      take: limit,
      skip: offset,
      where: filter,
      orderBy: sort,
      select: flowerSelect,
    }),
    db.flower.count({ where: filter }),
  ]);

  return buildPaginationResponse(flowersTransformer(flowers), page, limit, total);
};

export const getFlowerById = async (id: string, admin: { role: number; shopId: string | null }) => {
  const flower = await db.flower.findUnique({
    where: { id, deletedAt: null },
    select: flowerSelect,
  });

  if (!flower) {
    throw new NotFoundError(ErrorMessages.FlowerNotFound, ErrorCodes.FlowerNotFound);
  }

  // Shop admin faqat o'z do'konining gulini ko'ra oladi
  if (admin.role === AdminRole.ShopAdmin && admin.shopId !== flower.shopId) {
    throw new ForbiddenError();
  }

  return flowerTransformer(flower);
};

export const createFlower = async (
  data: TCreateFlowerDto['body'],
  admin: { role: number; shopId: string | null }
) => {
  // Shop admin faqat o'z do'koniga gul qo'sha oladi
  if (admin.role === AdminRole.ShopAdmin) {
    if (admin.shopId !== data.shopId) {
      throw new ForbiddenError();
    }
  }

  const flower = await db.flower.create({
    data: {
      shopId: data.shopId,
      categoryId: data.categoryId,
      price: data.price,
      discountPrice: data.discountPrice,
      images: data.images,
      status: data.status,
      translations: {
        create: data.translations.map(t => ({
          language: t.language,
          name: t.name,
          description: t.description,
        })),
      },
    },
    select: flowerSelect,
  });

  return flowerTransformer(flower);
};

export const updateFlower = async (
  id: string,
  data: TUpdateFlowerDto['body'],
  admin: { role: number; shopId: string | null }
) => {
  const existing = await db.flower.findUnique({
    where: { id, deletedAt: null },
    select: { shopId: true },
  });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.FlowerNotFound, ErrorCodes.FlowerNotFound);
  }

  if (admin.role === AdminRole.ShopAdmin && admin.shopId !== existing.shopId) {
    throw new ForbiddenError();
  }

  const flower = await db.flower.update({
    where: { id },
    data: {
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.discountPrice !== undefined && { discountPrice: data.discountPrice }),
      ...(data.images && { images: data.images }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.translations && {
        translations: {
          deleteMany: {},
          create: data.translations.map(t => ({
            language: t.language,
            name: t.name,
            description: t.description,
          })),
        },
      }),
    },
    select: flowerSelect,
  });

  return flowerTransformer(flower);
};

export const deleteFlower = async (id: string, admin: { role: number; shopId: string | null }) => {
  const existing = await db.flower.findUnique({
    where: { id, deletedAt: null },
    select: { shopId: true },
  });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.FlowerNotFound, ErrorCodes.FlowerNotFound);
  }

  if (admin.role === AdminRole.ShopAdmin && admin.shopId !== existing.shopId) {
    throw new ForbiddenError();
  }

  await db.flower.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};
