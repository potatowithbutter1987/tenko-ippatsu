import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import type {
  Driver,
  DriverId,
  DriverRegistrationInput,
} from "@/features/driver/types";

const toDriver = (row: typeof users.$inferSelect): Driver => ({
  id: row.id,
  name: row.name,
  status: row.status,
  currentCompanyId: row.currentCompanyId,
  createdAt: row.createdAt.toISOString(),
});

export const driverRepository = {
  async findById(id: DriverId): Promise<Driver | null> {
    const [row] = await db.select().from(users).where(eq(users.id, id));
    return row ? toDriver(row) : null;
  },

  async create(input: DriverRegistrationInput): Promise<Driver> {
    const [row] = await db
      .insert(users)
      .values({
        lineUserId: input.lineUserId,
        name: input.name,
        birthDate: input.birthDate,
        phoneNumber: input.phoneNumber,
        email: input.email,
        selfReportedCompanyName: input.selfReportedCompanyName,
        selfReportedVehicleNo: input.selfReportedVehicleNo,
        selfReportedAt: new Date(),
      })
      .returning();
    return toDriver(row);
  },
};
