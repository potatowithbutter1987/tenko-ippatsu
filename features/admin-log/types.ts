export type AdminLogId = string;

export type AdminLog = {
  id: AdminLogId;
  adminUserId: string;
  actionType: number;
  targetTable: string;
  targetId: string | null;
  createdAt: string;
};

export type AdminLogInput = {
  adminUserId: string;
  actionType: number;
  targetTable: string;
  targetId?: string;
  diff?: unknown;
  ipAddress?: string;
  userAgent?: string;
};
