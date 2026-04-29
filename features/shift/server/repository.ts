import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { shifts } from "@/db/schema";
import type { Shift, ShiftId } from "@/features/shift/types";

const toShift = (row: typeof shifts.$inferSelect): Shift => ({
  id: row.id,
  userId: row.userId,
  scheduledDate: row.scheduledDate,
  projectId: row.projectId,
  vehicleId: row.vehicleId,
  status: row.status,
});

export const shiftRepository = {
  async findById(id: ShiftId): Promise<Shift | null> {
    const [row] = await db.select().from(shifts).where(eq(shifts.id, id));
    return row ? toShift(row) : null;
  },
};
