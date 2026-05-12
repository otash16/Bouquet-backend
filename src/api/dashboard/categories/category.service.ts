import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { NotFoundError } from '../../../errors/index.ts';
import { buildPagination, buildPaginationResponse, buildSort } from '../../../utilities/index.ts';
import type {
  TCreateCategoryDto,
  TGetCategoriesDto,
  TUpdateCategoryDto,
} from './utils/category.dto.ts';
import { buildCategoryFilter } from './utils/category.filter.ts';
import { categoriesTransformer, categoryTransformer } from './utils/category.transformer.ts';

const categorySelect = {
  id: true,
  slug: true,
  image: true,
  status: true,
  translations: {
    select: { language: true, name: true },
  },
  createdAt: true,
  updatedAt: true,
} as const;

export const getCategories = async (query: TGetCategoriesDto['query']) => {
  const sort = buildSort(query);
  const { offset, limit, page } = buildPagination(query);
  const filter = buildCategoryFilter(query.search);

  const [categories, total] = await Promise.all([
    db.category.findMany({
      take: limit,
      skip: offset,
      where: filter,
      orderBy: sort,
      select: categorySelect,
    }),
    db.category.count({ where: filter }),
  ]);

  return buildPaginationResponse(categoriesTransformer(categories), page, limit, total);
};

export const getCategoryById = async (id: string) => {
  const category = await db.category.findUnique({
    where: { id, deletedAt: null },
    select: categorySelect,
  });

  if (!category) {
    throw new NotFoundError(ErrorMessages.CategoryNotFound, ErrorCodes.CategoryNotFound);
  }

  return categoryTransformer(category);
};

export const createCategory = async (data: TCreateCategoryDto['body']) => {
  const category = await db.category.create({
    data: {
      slug: data.slug,
      image: data.image,
      status: data.status,
      translations: {
        create: data.translations.map(t => ({
          language: t.language,
          name: t.name,
        })),
      },
    },
    select: categorySelect,
  });

  return categoryTransformer(category);
};

export const updateCategory = async (id: string, data: TUpdateCategoryDto['body']) => {
  const existing = await db.category.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.CategoryNotFound, ErrorCodes.CategoryNotFound);
  }

  const category = await db.category.update({
    where: { id },
    data: {
      ...(data.slug && { slug: data.slug }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.translations && {
        translations: {
          deleteMany: {},
          create: data.translations.map(t => ({
            language: t.language,
            name: t.name,
          })),
        },
      }),
    },
    select: categorySelect,
  });

  return categoryTransformer(category);
};

export const deleteCategory = async (id: string) => {
  const existing = await db.category.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(ErrorMessages.CategoryNotFound, ErrorCodes.CategoryNotFound);
  }

  await db.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};
