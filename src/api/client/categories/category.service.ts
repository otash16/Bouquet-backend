import { db } from '../../../config/index.ts';

export const getCategories = async (language = 'uz') => {
  const categories = await db.category.findMany({
    where: { status: 1, deletedAt: null },
    select: {
      id: true,
      slug: true,
      image: true,
      translations: {
        where: { language },
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return categories.map(c => ({
    id: c.id,
    slug: c.slug,
    image: c.image,
    name: c.translations[0]?.name ?? '',
  }));
};
