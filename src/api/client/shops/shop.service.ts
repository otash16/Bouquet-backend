import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { NotFoundError } from '../../../errors/index.ts';

export const getShops = async (language = 'uz') => {
  const shops = await db.shop.findMany({
    where: { status: 1, deletedAt: null },
    select: {
      id: true,
      slug: true,
      logo: true,
      coverImage: true,
      phone: true,
      address: true,
      translations: {
        where: { language },
        select: { name: true, description: true },
      },
      _count: { select: { flowers: { where: { status: 1, deletedAt: null } } } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return shops.map(s => ({
    id: s.id,
    slug: s.slug,
    logo: s.logo,
    coverImage: s.coverImage,
    phone: s.phone,
    address: s.address,
    name: s.translations[0]?.name ?? '',
    description: s.translations[0]?.description ?? null,
    flowerCount: s._count.flowers,
  }));
};

export const getShopBySlug = async (slug: string, language = 'uz') => {
  const shop = await db.shop.findUnique({
    where: { slug, status: 1, deletedAt: null },
    select: {
      id: true,
      slug: true,
      logo: true,
      coverImage: true,
      phone: true,
      address: true,
      latitude: true,
      longitude: true,
      translations: {
        where: { language },
        select: { name: true, description: true },
      },
      _count: { select: { flowers: { where: { status: 1, deletedAt: null } } } },
    },
  });

  if (!shop) {
    throw new NotFoundError(ErrorMessages.ShopNotFound, ErrorCodes.ShopNotFound);
  }

  return {
    id: shop.id,
    slug: shop.slug,
    logo: shop.logo,
    coverImage: shop.coverImage,
    phone: shop.phone,
    address: shop.address,
    latitude: shop.latitude,
    longitude: shop.longitude,
    name: shop.translations[0]?.name ?? '',
    description: shop.translations[0]?.description ?? null,
    flowerCount: shop._count.flowers,
  };
};
