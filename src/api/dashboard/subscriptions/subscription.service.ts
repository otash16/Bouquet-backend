import dayjs from 'dayjs';
import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { SubscriptionStatus } from '../../../enums/index.ts';
import { NotFoundError } from '../../../errors/index.ts';
import { buildPagination, buildPaginationResponse, buildSort } from '../../../utilities/index.ts';
import type { Prisma } from '../../shared/types/prisma.types.ts';
import type { TCreateSubscriptionDto, TGetSubscriptionsDto } from './utils/subscription.dto.ts';

const subscriptionSelect = {
  id: true,
  shopId: true,
  tariffId: true,
  startDate: true,
  endDate: true,
  status: true,
  shop: {
    select: {
      translations: { where: { language: 'uz' }, select: { name: true } },
    },
  },
  tariff: {
    select: {
      price: true,
      durationDays: true,
      flowerLimit: true,
      translations: { where: { language: 'uz' }, select: { name: true } },
    },
  },
  createdAt: true,
} as const;

export const getSubscriptions = async (query: TGetSubscriptionsDto['query']) => {
  const sort = buildSort(query);
  const { offset, limit, page } = buildPagination(query);

  const filter: Prisma.SubscriptionWhereInput = { deletedAt: null };

  if (query.shopId) {
    filter.shopId = query.shopId;
  }

  if (query.status !== undefined) {
    filter.status = query.status;
  }

  const [subscriptions, total] = await Promise.all([
    db.subscription.findMany({
      take: limit,
      skip: offset,
      where: filter,
      orderBy: sort,
      select: subscriptionSelect,
    }),
    db.subscription.count({ where: filter }),
  ]);

  const records = subscriptions.map(s => ({
    id: s.id,
    shopId: s.shopId,
    shopName: s.shop.translations[0]?.name ?? '',
    tariffId: s.tariffId,
    tariffName: s.tariff.translations[0]?.name ?? '',
    tariffPrice: s.tariff.price,
    flowerLimit: s.tariff.flowerLimit,
    startDate: s.startDate,
    endDate: s.endDate,
    status: s.status,
    createdAt: s.createdAt,
  }));

  return buildPaginationResponse(records, page, limit, total);
};

export const getSubscriptionById = async (id: string) => {
  const subscription = await db.subscription.findUnique({
    where: { id, deletedAt: null },
    select: subscriptionSelect,
  });

  if (!subscription) {
    throw new NotFoundError(ErrorMessages.SubscriptionNotFound, ErrorCodes.SubscriptionNotFound);
  }

  return {
    id: subscription.id,
    shopId: subscription.shopId,
    shopName: subscription.shop.translations[0]?.name ?? '',
    tariffId: subscription.tariffId,
    tariffName: subscription.tariff.translations[0]?.name ?? '',
    tariffPrice: subscription.tariff.price,
    flowerLimit: subscription.tariff.flowerLimit,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    status: subscription.status,
    createdAt: subscription.createdAt,
  };
};

export const createSubscription = async (data: TCreateSubscriptionDto['body']) => {
  // Tariff borligini tekshirish
  const tariff = await db.tariff.findUnique({
    where: { id: data.tariffId, status: 1, deletedAt: null },
  });

  if (!tariff) {
    throw new NotFoundError(ErrorMessages.TariffNotFound, ErrorCodes.TariffNotFound);
  }

  // Shop borligini tekshirish
  const shop = await db.shop.findUnique({
    where: { id: data.shopId, deletedAt: null },
  });

  if (!shop) {
    throw new NotFoundError(ErrorMessages.ShopNotFound, ErrorCodes.ShopNotFound);
  }

  // Eski aktiv subscriptionlarni inactive qilish
  await db.subscription.updateMany({
    where: {
      shopId: data.shopId,
      status: SubscriptionStatus.Active,
      deletedAt: null,
    },
    data: { status: SubscriptionStatus.Inactive },
  });

  const startDate = new Date();
  const endDate = dayjs(startDate).add(tariff.durationDays, 'day').toDate();

  const subscription = await db.subscription.create({
    data: {
      shopId: data.shopId,
      tariffId: data.tariffId,
      startDate,
      endDate,
      status: SubscriptionStatus.Active,
    },
    select: subscriptionSelect,
  });

  return {
    id: subscription.id,
    shopId: subscription.shopId,
    shopName: subscription.shop.translations[0]?.name ?? '',
    tariffId: subscription.tariffId,
    tariffName: subscription.tariff.translations[0]?.name ?? '',
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    status: subscription.status,
    createdAt: subscription.createdAt,
  };
};

export const cancelSubscription = async (id: string) => {
  const subscription = await db.subscription.findUnique({
    where: { id, deletedAt: null },
  });

  if (!subscription) {
    throw new NotFoundError(ErrorMessages.SubscriptionNotFound, ErrorCodes.SubscriptionNotFound);
  }

  await db.subscription.update({
    where: { id },
    data: { status: SubscriptionStatus.Inactive },
  });

  return true;
};
