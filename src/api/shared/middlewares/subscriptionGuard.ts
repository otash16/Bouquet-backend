import type { NextFunction, Request, Response } from 'express';
import { db } from '../../../config/index.ts';
import { ErrorCodes, ErrorMessages } from '../../../constants/index.ts';
import { AdminRole, SubscriptionStatus } from '../../../enums/index.ts';
import { BadRequestError, ForbiddenError } from '../../../errors/index.ts';

export default async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    // SuperAdmin cheklovsiz ishlaydi
    if (req.admin?.role === AdminRole.SuperAdmin) {
      return next();
    }

    const shopId = req.admin?.shopId;

    if (!shopId) {
      throw new ForbiddenError(ErrorMessages.SubscriptionRequired);
    }

    // Aktiv subscription bormi tekshirish
    const subscription = await db.subscription.findFirst({
      where: {
        shopId,
        status: SubscriptionStatus.Active,
        endDate: { gte: new Date() },
        deletedAt: null,
      },
      include: {
        tariff: { select: { flowerLimit: true } },
      },
    });

    if (!subscription) {
      throw new BadRequestError(
        ErrorMessages.SubscriptionRequired,
        ErrorCodes.SubscriptionRequired
      );
    }

    // Flower limit tekshirish (0 = cheksiz)
    if (subscription.tariff.flowerLimit > 0) {
      const flowerCount = await db.flower.count({
        where: { shopId, deletedAt: null },
      });

      if (flowerCount >= subscription.tariff.flowerLimit) {
        throw new BadRequestError(ErrorMessages.FlowerLimitReached, ErrorCodes.FlowerLimitReached);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
