import "server-only";

import { vehicleRepository } from "@/features/vehicle/server/repository";
import type { Vehicle, VehicleId } from "@/features/vehicle/types";

export const vehicleService = {
  async getById(id: VehicleId): Promise<Vehicle | null> {
    return vehicleRepository.findById(id);
  },
};
