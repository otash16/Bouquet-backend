export enum ErrorCodes {
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  BadRequest = 'BAD_REQUEST',
  NotFound = 'NOT_FOUND',
  NotFoundPath = 'NOT_FOUND_PATH',
  Forbidden = 'FORBIDDEN',
  ValidationError = 'VALIDATION_ERROR',
  Unauthorized = 'UNAUTHORIZED',
  JwtError = 'JWT_ERROR',
  PrismaError = 'PRISMA_ERROR',
  EntityTooLarge = 'ENTITY_TOO_LARGE',
  // Admin
  AdminNotFound = 'ADMIN_NOT_FOUND',
  AdminAlreadyExists = 'ADMIN_ALREADY_EXISTS',
  // Shop
  ShopNotFound = 'SHOP_NOT_FOUND',
  // Flower
  FlowerNotFound = 'FLOWER_NOT_FOUND',
  // Category
  CategoryNotFound = 'CATEGORY_NOT_FOUND',
  // Tariff
  TariffNotFound = 'TARIFF_NOT_FOUND',
  // Subscription
  SubscriptionNotFound = 'SUBSCRIPTION_NOT_FOUND',
  SubscriptionRequired = 'SUBSCRIPTION_REQUIRED',
  FlowerLimitReached = 'FLOWER_LIMIT_REACHED',
}

export enum ErrorMessages {
  InternalServerError = 'Internal server error',
  BadRequest = 'Bad request',
  NotFound = 'Not found',
  NotFoundPath = 'Not found path',
  Forbidden = "You don't have permission",
  ValidationError = 'Validation error',
  Unauthorized = 'Unauthorized',
  PrismaError = 'Prisma error',
  // Admin
  AdminNotFound = 'Admin not found',
  AdminAlreadyExists = 'Admin already exists',
  // Shop
  ShopNotFound = 'Shop not found',
  // Flower
  FlowerNotFound = 'Flower not found',
  // Category
  CategoryNotFound = 'Category not found',
  // Tariff
  TariffNotFound = 'Tariff not found',
  // Subscription
  SubscriptionNotFound = 'Subscription not found',
  SubscriptionRequired = 'Active subscription required to perform this action',
  FlowerLimitReached = 'Flower limit reached for your subscription plan',
}

export enum ValidationErrorCodes {
  InvalidPayload = 'INVALID_PAYLOAD',
}
