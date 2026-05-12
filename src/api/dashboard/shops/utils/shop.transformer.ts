interface ShopWithTranslations {
  id: string;
  slug: string;
  logo: string | null;
  coverImage: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: number;
  translations: { language: string; name: string; description: string | null }[];
  _count?: { flowers: number };
  createdAt: Date;
  updatedAt: Date;
}

export const shopTransformer = (shop: ShopWithTranslations) => ({
  id: shop.id,
  slug: shop.slug,
  logo: shop.logo,
  coverImage: shop.coverImage,
  phone: shop.phone,
  address: shop.address,
  latitude: shop.latitude,
  longitude: shop.longitude,
  status: shop.status,
  translations: shop.translations,
  flowerCount: shop._count?.flowers ?? 0,
  createdAt: shop.createdAt,
  updatedAt: shop.updatedAt,
});

export const shopsTransformer = (shops: ShopWithTranslations[]) => shops.map(shopTransformer);
