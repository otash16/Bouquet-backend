import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { AdminRole } from '../../../enums/index.ts';
import { ForbiddenError, NotFoundError } from '../../../errors/index.ts';
import { buildPagination, buildPaginationResponse, buildSort } from '../../../utilities/index.ts';
import type { TCreateShopDto, TGetShopsDto, TUpdateShopDto } from './utils/shop.dto.ts';
import { buildShopFilter } from './utils/shop.filter.ts';
import { shopTransformer, shopsTransformer } from './utils/shop.transformer.ts';

const shopSelect = {
  id: true,
  slug: true,
  logo: true,
  coverImage: true,
  phone: true,
  address: true,
  latitude: true,
  longitude: true,
  status: true,
  translations: {
    select: { language: true, name: true, description: true },
  },
  _count: { select: { flowers: true } },
  createdAt: true,
  updatedAt: true,
} as const;

export const getShops = async (
  query: TGetShopsDto['query'],
  admin: { role: number; shopId: string | null }
) => {
  const sort = buildSort(query);
  const { offset, limit, page } = buildPagination(query);
  const filter = buildShopFilter({
    search: query.search,
    status: query.status,
    shopId: admin.role === AdminRole.ShopAdmin ? admin.shopId : null,
  });

  const [shops, total] = await Promise.all([
    db.shop.findMany({
      take: limit,
      skip: offset,
      where: filter,
      orderBy: sort,
      select: shopSelect,
    }),
    db.shop.count({ where: filter }),
  ]);

  return buildPaginationResponse(shopsTransformer(shops), page, limit, total);
};

export const getShopById = async (id: string, admin: { role: number; shopId: string | null }) => {
  // Shop admin faqat o'z do'konini ko'ra oladi
  if (admin.role === AdminRole.ShopAdmin && admin.shopId !== id) {
    throw new ForbiddenError();
  }

  const shop = await db.shop.findUnique({
    where: { id, deletedAt: null },
    select: shopSelect,
  });

  if (!shop) {
    throw new NotFoundError(ErrorMessages.ShopNotFound, ErrorCodes.ShopNotFound);
  }

  return shopTransformer(shop);
};

export const createShop = async (data: TCreateShopDto['body']) => {
  const shop = await db.shop.create({
    data: {
      slug: data.slug,
      logo: data.logo,
      coverImage: data.coverImage,
      phone: data.phone,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      status: data.status,
      translations: {
        create: data.translations.map(t => ({
          language: t.language,
          name: t.name,
          description: t.description,
        })),
      },
    },
    select: shopSelect,
  });

  return shopTransformer(shop);
};

export const updateShop = async (
  id: string,
  data: TUpdateShopDto['body'],
  admin: { role: number; shopId: string | null }
) => {
  // Shop admin faqat o'z do'konini o'zgartira oladi
  if (admin.role === AdminRole.ShopAdmin && admin.shopId !== id) {
    throw new ForbiddenError();
  }

  const existing = await db.shop.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.ShopNotFound, ErrorCodes.ShopNotFound);
  }

  const shop = await db.shop.update({
    where: { id },
    data: {
      ...(data.slug && { slug: data.slug }),
      ...(data.logo !== undefined && { logo: data.logo }),
      ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
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
    select: shopSelect,
  });

  return shopTransformer(shop);
};

export const deleteShop = async (id: string) => {
  const existing = await db.shop.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.ShopNotFound, ErrorCodes.ShopNotFound);
  }

  await db.shop.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};
