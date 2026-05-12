interface FlowerWithRelations {
  id: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  status: number;
  shopId: string;
  categoryId: string | null;
  shop: { translations: { name: string }[] };
  category: { translations: { name: string }[] } | null;
  translations: { language: string; name: string; description: string | null }[];
  createdAt: Date;
  updatedAt: Date;
}

export const flowerTransformer = (flower: FlowerWithRelations) => ({
  id: flower.id,
  price: flower.price,
  discountPrice: flower.discountPrice,
  images: flower.images,
  status: flower.status,
  shopId: flower.shopId,
  shopName: flower.shop.translations[0]?.name ?? '',
  categoryId: flower.categoryId,
  categoryName: flower.category?.translations[0]?.name ?? null,
  translations: flower.translations,
  createdAt: flower.createdAt,
  updatedAt: flower.updatedAt,
});

export const flowersTransformer = (flowers: FlowerWithRelations[]) =>
  flowers.map(flowerTransformer);
