import dayjs from 'dayjs';
import { db } from '../../../config/index.ts';
import { SubscriptionStatus } from '../../../enums/index.ts';

export const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = dayjs(now).startOf('month').toDate();
  const startOfDay = dayjs(now).startOf('day').toDate();

  // Oxirgi 30 kun uchun kunlik visitlar
  const thirtyDaysAgo = dayjs(now).subtract(30, 'day').startOf('day').toDate();

  const [
    shopCount,
    flowerCount,
    categoryCount,
    adminCount,
    activeSubscriptions,
    totalUsers,
    monthlyNewUsers,
    totalVisits,
    monthlyVisits,
    todayVisits,
    recentShops,
    dailyVisits,
  ] = await Promise.all([
    db.shop.count({ where: { deletedAt: null } }),
    db.flower.count({ where: { deletedAt: null } }),
    db.category.count({ where: { deletedAt: null } }),
    db.admin.count({ where: { deletedAt: null } }),
    db.subscription.count({
      where: { status: SubscriptionStatus.Active, endDate: { gte: now }, deletedAt: null },
    }),
    // User statistika
    db.user.count({ where: { deletedAt: null } }),
    db.user.count({ where: { deletedAt: null, createdAt: { gte: startOfMonth } } }),
    // Visit statistika
    db.userVisit.count(),
    db.userVisit.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.userVisit.count({ where: { createdAt: { gte: startOfDay } } }),
    // Oxirgi do'konlar
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
    // Oxirgi 30 kunlik kunlik visitlar (grafik uchun)
    db.userVisit.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Kunlik visit hisobi
  const visitsByDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const day = dayjs(now).subtract(i, 'day').format('YYYY-MM-DD');
    visitsByDay[day] = 0;
  }
  for (const visit of dailyVisits) {
    const day = dayjs(visit.createdAt).format('YYYY-MM-DD');
    if (visitsByDay[day] !== undefined) {
      visitsByDay[day]++;
    }
  }

  const visitChart = Object.entries(visitsByDay).map(([date, count]) => ({
    date,
    label: dayjs(date).format('DD.MM'),
    count,
  }));

  return {
    counts: {
      shops: shopCount,
      flowers: flowerCount,
      categories: categoryCount,
      admins: adminCount,
      activeSubscriptions,
    },
    users: {
      total: totalUsers,
      monthlyNew: monthlyNewUsers,
    },
    visits: {
      total: totalVisits,
      monthly: monthlyVisits,
      today: todayVisits,
    },
    visitChart,
    recentShops: recentShops.map(s => ({
      id: s.id,
      name: s.translations[0]?.name ?? s.slug,
      status: s.status,
      flowerCount: s._count.flowers,
      createdAt: s.createdAt,
    })),
  };
};
