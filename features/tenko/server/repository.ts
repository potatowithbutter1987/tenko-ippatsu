import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { dailyReports } from "@/db/schema";
import type { DailyReport, DailyReportId } from "@/features/tenko/types";

const toDailyReport = (row: typeof dailyReports.$inferSelect): DailyReport => ({
  id: row.id,
  userId: row.userId,
  targetDate: row.targetDate,
  isAlert: row.isAlert,
});

export const tenkoRepository = {
  async findById(id: DailyReportId): Promise<DailyReport | null> {
    const [row] = await db
      .select()
      .from(dailyReports)
      .where(eq(dailyReports.id, id));
    return row ? toDailyReport(row) : null;
  },
};
