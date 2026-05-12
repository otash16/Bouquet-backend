import { db } from '../../../config/index.ts';
import { SubscriptionStatus } from '../../../enums/index.ts';

export const getDashboardStats = async () => {
  const [shopCount, flowerCount, categoryCount, adminCount, activeSubscriptions, recentShops] =
    await Promise.all([
      db.shop.count({ where: { deletedAt: null } }),
      db.flower.count({ where: { deletedAt: null } }),
      db.category.count({ where: { deletedAt: null } }),
      db.admin.count({ where: { deletedAt: null } }),
      db.subscription.count({
        where: { status: SubscriptionStatus.Active, endDate: { gte: new Date() }, deletedAt: null },
      }),
      db.shop.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          slug: true,
          status: true,
          translations: { where: { language: 'uz' }, select: { name: true } },
          _count: { select: { flowers: { where: { deletedAt: null } } } },
          createdAt: true,
        },
      }),
    ]);

  return {
    counts: {
      shops: shopCount,
      flowers: flowerCount,
      categories: categoryCount,
      admins: adminCount,
      activeSubscriptions,
    },
    recentShops: recentShops.map(s => ({
      id: s.id,
      name: s.translations[0]?.name ?? s.slug,
      status: s.status,
      flowerCount: s._count.flowers,
      createdAt: s.createdAt,
    })),
  };
};
