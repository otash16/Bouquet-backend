import bcrypt from 'bcryptjs';
import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { ForbiddenError, NotFoundError } from '../../../errors/index.ts';
import { hashPassword } from '../../../utilities/index.ts';
import { buildPagination, buildPaginationResponse, buildSort } from '../../../utilities/index.ts';
import type { Prisma } from '../../shared/types/prisma.types.ts';
import type { TCreateAdminDto, TGetAdminsDto, TUpdateAdminDto } from './utils/admin.dto.ts';

const adminSelect = {
  id: true,
  fullName: true,
  username: true,
  phoneNumber: true,
  role: true,
  status: true,
  shopId: true,
  shop: {
    select: {
      translations: { where: { language: 'uz' }, select: { name: true } },
    },
  },
  createdAt: true,
  updatedAt: true,
} as const;

const transformAdmin = (admin: any) => ({
  id: admin.id,
  fullName: admin.fullName,
  username: admin.username,
  phoneNumber: admin.phoneNumber,
  role: admin.role,
  status: admin.status,
  shopId: admin.shopId,
  shopName: admin.shop?.translations[0]?.name ?? null,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

export const getAdmins = async (query: TGetAdminsDto['query'], currentAdminId: string) => {
  const sort = buildSort(query);
  const { offset, limit, page } = buildPagination(query);

  const filter: Prisma.AdminWhereInput = {
    id: { not: currentAdminId },
    deletedAt: null,
  };

  if (query.shopId) {
    filter.shopId = query.shopId;
  }

  if (query.search) {
    filter.OR = [
      { fullName: { contains: query.search, mode: 'insensitive' } },
      { username: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [admins, total] = await Promise.all([
    db.admin.findMany({
      take: limit,
      skip: offset,
      where: filter,
      orderBy: sort,
      select: adminSelect,
    }),
    db.admin.count({ where: filter }),
  ]);

  return buildPaginationResponse(admins.map(transformAdmin), page, limit, total);
};

export const getAdminById = async (id: string) => {
  const admin = await db.admin.findUnique({
    where: { id, deletedAt: null },
    select: adminSelect,
  });

  if (!admin) {
    throw new NotFoundError(ErrorMessages.AdminNotFound, ErrorCodes.AdminNotFound);
  }

  return transformAdmin(admin);
};

export const createAdmin = async (data: TCreateAdminDto['body']) => {
  const passwordHash = await hashPassword(data.password);

  const admin = await db.admin.create({
    data: {
      fullName: data.fullName,
      username: data.username,
      phoneNumber: data.phoneNumber,
      passwordHash,
      role: data.role,
      shopId: data.shopId ?? null,
      status: data.status,
    },
    select: adminSelect,
  });

  return transformAdmin(admin);
};

export const updateAdmin = async (
  id: string,
  data: TUpdateAdminDto['body'],
  currentAdminId: string
) => {
  const existing = await db.admin.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.AdminNotFound, ErrorCodes.AdminNotFound);
  }

  // O'zini o'zi o'chira olmaydi
  if (id === currentAdminId && data.status === -2) {
    throw new ForbiddenError('You cannot block yourself');
  }

  const updateData: Record<string, any> = {};
  if (data.fullName) updateData.fullName = data.fullName;
  if (data.username) updateData.username = data.username;
  if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.shopId !== undefined) updateData.shopId = data.shopId;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  const admin = await db.admin.update({
    where: { id },
    data: updateData,
    select: adminSelect,
  });

  return transformAdmin(admin);
};

export const deleteAdmin = async (id: string, currentAdminId: string) => {
  if (id === currentAdminId) {
    throw new ForbiddenError('You cannot delete yourself');
  }

  const existing = await db.admin.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.AdminNotFound, ErrorCodes.AdminNotFound);
  }

  await db.admin.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};
