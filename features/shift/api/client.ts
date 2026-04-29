import type { Shift, ShiftId } from "@/features/shift/types";
import { apiFetch } from "@/lib/api-client";

export const shiftApi = {
  async getById(id: ShiftId): Promise<Shift | null> {
    return apiFetch<Shift | null>(`/api/shifts/${id}`);
  },
};
