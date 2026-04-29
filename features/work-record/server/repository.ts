import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { workRecords } from "@/db/schema";
import type { WorkRecord, WorkRecordId } from "@/features/work-record/types";

const toWorkRecord = (row: typeof workRecords.$inferSelect): WorkRecord => ({
  id: row.id,
  userId: row.userId,
  shiftId: row.shiftId,
  targetDate: row.targetDate,
  projectId: row.projectId,
});

export const workRecordRepository = {
  async findById(id: WorkRecordId): Promise<WorkRecord | null> {
    const [row] = await db
      .select()
      .from(workRecords)
      .where(eq(workRecords.id, id));
    return row ? toWorkRecord(row) : null;
  },
};
