import "server-only";

import { adminLogRepository } from "@/features/admin-log/server/repository";
import type { AdminLog, AdminLogInput } from "@/features/admin-log/types";

export const adminLogService = {
  async record(input: AdminLogInput): Promise<AdminLog> {
    return adminLogRepository.create(input);
  },
};
