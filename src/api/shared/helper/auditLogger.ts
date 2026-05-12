import { db } from '../../../config/index.ts';
import type { LogAction } from '../../../enums/index.ts';

interface IAuditLog {
  action: LogAction;
  entityType: string;
  entityId: string;
  adminId: string;
  shopId?: string | null;
  previousData?: object | null;
  changedData?: object | null;
}

export const writeAuditLog = async (data: IAuditLog) => {
  await db.auditLog.create({
    data: {
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      adminId: data.adminId,
      shopId: data.shopId,
      previousData: data.previousData ?? undefined,
      changedData: data.changedData ?? undefined,
    },
  });
};
