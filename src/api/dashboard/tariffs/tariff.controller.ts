import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as TariffService from './tariff.service.ts';
import type {
  TCreateTariffDto,
  TDeleteTariffDto,
  TGetTariffByIdDto,
  TGetTariffsDto,
  TUpdateTariffDto,
} from './utils/tariff.dto.ts';

export const getTariffs = async (req: Request, res: Response) => {
  const response = await TariffService.getTariffs(req.validated.query as TGetTariffsDto['query']);
  res.success(HttpStatus.Ok, response);
};

export const getTariffById = async (req: Request, res: Response) => {
  const response = await TariffService.getTariffById(
    req.validated.params.id as TGetTariffByIdDto['params']['id']
  );
  res.success(HttpStatus.Ok, response);
};

export const createTariff = async (req: Request, res: Response) => {
  const response = await TariffService.createTariff(req.validated.body as TCreateTariffDto['body']);
  res.success(HttpStatus.Created, response);
};

export const updateTariff = async (req: Request, res: Response) => {
  const response = await TariffService.updateTariff(
    req.validated.params.id as TUpdateTariffDto['params']['id'],
    req.validated.body as TUpdateTariffDto['body']
  );
  res.success(HttpStatus.Ok, response);
};

export const deleteTariff = async (req: Request, res: Response) => {
  await TariffService.deleteTariff(req.validated.params.id as TDeleteTariffDto['params']['id']);
  res.success(HttpStatus.Ok, { message: 'Tariff deleted successfully' });
};
