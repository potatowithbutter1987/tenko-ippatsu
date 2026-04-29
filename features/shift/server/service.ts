import "server-only";

import { shiftRepository } from "@/features/shift/server/repository";
import type { Shift, ShiftId } from "@/features/shift/types";

export const shiftService = {
  async getById(id: ShiftId): Promise<Shift | null> {
    return shiftRepository.findById(id);
  },
};
