import "server-only";

import { workRecordRepository } from "@/features/work-record/server/repository";
import type { WorkRecord, WorkRecordId } from "@/features/work-record/types";

export const workRecordService = {
  async getById(id: WorkRecordId): Promise<WorkRecord | null> {
    return workRecordRepository.findById(id);
  },
};
