import "server-only";

import { tenkoRepository } from "@/features/tenko/server/repository";
import type { DailyReport, DailyReportId } from "@/features/tenko/types";

export const tenkoService = {
  async getById(id: DailyReportId): Promise<DailyReport | null> {
    return tenkoRepository.findById(id);
  },
};
