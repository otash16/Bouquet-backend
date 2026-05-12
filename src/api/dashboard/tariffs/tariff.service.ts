import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { NotFoundError } from '../../../errors/index.ts';
import { buildPagination, buildPaginationResponse, buildSort } from '../../../utilities/index.ts';
import type { TCreateTariffDto, TGetTariffsDto, TUpdateTariffDto } from './utils/tariff.dto.ts';

const tariffSelect = {
  id: true,
  price: true,
  durationDays: true,
  flowerLimit: true,
  status: true,
  translations: {
    select: { language: true, name: true, description: true },
  },
  _count: { select: { subscriptions: true } },
  createdAt: true,
  updatedAt: true,
} as const;

export const getTariffs = async (query: TGetTariffsDto['query']) => {
  const sort = buildSort(query);
  const { offset, limit, page } = buildPagination(query);
  const filter = { deletedAt: null };

  const [tariffs, total] = await Promise.all([
    db.tariff.findMany({
      take: limit,
      skip: offset,
      where: filter,
      orderBy: sort,
      select: tariffSelect,
    }),
    db.tariff.count({ where: filter }),
  ]);

  const records = tariffs.map(t => ({
    ...t,
    subscriptionCount: t._count.subscriptions,
    _count: undefined,
  }));

  return buildPaginationResponse(records, page, limit, total);
};

export const getTariffById = async (id: string) => {
  const tariff = await db.tariff.findUnique({
    where: { id, deletedAt: null },
    select: tariffSelect,
  });

  if (!tariff) {
    throw new NotFoundError(ErrorMessages.TariffNotFound, ErrorCodes.TariffNotFound);
  }

  return { ...tariff, subscriptionCount: tariff._count.subscriptions, _count: undefined };
};

export const createTariff = async (data: TCreateTariffDto['body']) => {
  const tariff = await db.tariff.create({
    data: {
      price: data.price,
      durationDays: data.durationDays,
      flowerLimit: data.flowerLimit,
      status: data.status,
      translations: {
        create: data.translations.map(t => ({
          language: t.language,
          name: t.name,
          description: t.description,
        })),
      },
    },
    select: tariffSelect,
  });

  return tariff;
};

export const updateTariff = async (id: string, data: TUpdateTariffDto['body']) => {
  const existing = await db.tariff.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.TariffNotFound, ErrorCodes.TariffNotFound);
  }

  const tariff = await db.tariff.update({
    where: { id },
    data: {
      ...(data.price !== undefined && { price: data.price }),
      ...(data.durationDays !== undefined && { durationDays: data.durationDays }),
      ...(data.flowerLimit !== undefined && { flowerLimit: data.flowerLimit }),
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
    select: tariffSelect,
  });

  return tariff;
};

export const deleteTariff = async (id: string) => {
  const existing = await db.tariff.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.TariffNotFound, ErrorCodes.TariffNotFound);
  }

  await db.tariff.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};
