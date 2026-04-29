import type { WorkRecord, WorkRecordId } from "@/features/work-record/types";
import { apiFetch } from "@/lib/api-client";

export const workRecordApi = {
  async getById(id: WorkRecordId): Promise<WorkRecord | null> {
    return apiFetch<WorkRecord | null>(`/api/work-records/${id}`);
  },
};
