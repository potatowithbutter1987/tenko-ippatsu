import type { DailyReport, DailyReportId } from "@/features/tenko/types";
import { apiFetch } from "@/lib/api-client";

export const tenkoApi = {
  async getById(id: DailyReportId): Promise<DailyReport | null> {
    return apiFetch<DailyReport | null>(`/api/tenko/${id}`);
  },
};
