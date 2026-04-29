import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { vehicles } from "@/db/schema";
import type { Vehicle, VehicleId } from "@/features/vehicle/types";

const toVehicle = (row: typeof vehicles.$inferSelect): Vehicle => ({
  id: row.id,
  plateNumber: row.plateNumber,
  name: row.name,
  ownershipType: row.ownershipType,
  isActive: row.isActive,
});

export const vehicleRepository = {
  async findById(id: VehicleId): Promise<Vehicle | null> {
    const [row] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return row ? toVehicle(row) : null;
  },
};
