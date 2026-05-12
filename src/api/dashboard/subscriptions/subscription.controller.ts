import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as SubscriptionService from './subscription.service.ts';
import type {
  TCancelSubscriptionDto,
  TCreateSubscriptionDto,
  TGetSubscriptionByIdDto,
  TGetSubscriptionsDto,
} from './utils/subscription.dto.ts';

export const getSubscriptions = async (req: Request, res: Response) => {
  const response = await SubscriptionService.getSubscriptions(
    req.validated.query as TGetSubscriptionsDto['query']
  );
  res.success(HttpStatus.Ok, response);
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  const response = await SubscriptionService.getSubscriptionById(
    req.validated.params.id as TGetSubscriptionByIdDto['params']['id']
  );
  res.success(HttpStatus.Ok, response);
};

export const createSubscription = async (req: Request, res: Response) => {
  const response = await SubscriptionService.createSubscription(
    req.validated.body as TCreateSubscriptionDto['body']
  );
  res.success(HttpStatus.Created, response);
};

export const cancelSubscription = async (req: Request, res: Response) => {
  await SubscriptionService.cancelSubscription(
    req.validated.params.id as TCancelSubscriptionDto['params']['id']
  );
  res.success(HttpStatus.Ok, { message: 'Subscription cancelled successfully' });
};
