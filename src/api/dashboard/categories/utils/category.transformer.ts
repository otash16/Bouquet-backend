interface CategoryWithTranslations {
  id: string;
  slug: string;
  image: string | null;
  status: number;
  translations: { language: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export const categoryTransformer = (category: CategoryWithTranslations) => ({
  id: category.id,
  slug: category.slug,
  image: category.image,
  status: category.status,
  translations: category.translations,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const categoriesTransformer = (categories: CategoryWithTranslations[]) =>
  categories.map(categoryTransformer);
