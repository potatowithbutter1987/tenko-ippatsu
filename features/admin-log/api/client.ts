import type { AdminLog, AdminLogInput } from "@/features/admin-log/types";
import { apiFetch } from "@/lib/api-client";

export const adminLogApi = {
  async record(input: AdminLogInput): Promise<AdminLog> {
    return apiFetch<AdminLog>("/api/admin-logs", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
