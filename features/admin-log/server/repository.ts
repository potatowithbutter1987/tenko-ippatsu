import "server-only";

import { db } from "@/db";
import { adminActionLogs } from "@/db/schema";
import type { AdminLog, AdminLogInput } from "@/features/admin-log/types";

const toAdminLog = (row: typeof adminActionLogs.$inferSelect): AdminLog => ({
  id: row.id,
  adminUserId: row.adminUserId,
  actionType: row.actionType,
  targetTable: row.targetTable,
  targetId: row.targetId,
  createdAt: row.createdAt.toISOString(),
});

export const adminLogRepository = {
  async create(input: AdminLogInput): Promise<AdminLog> {
    const [row] = await db
      .insert(adminActionLogs)
      .values({
        adminUserId: input.adminUserId,
        actionType: input.actionType,
        targetTable: input.targetTable,
        targetId: input.targetId,
        diff: input.diff,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      })
      .returning();
    return toAdminLog(row);
  },
};
