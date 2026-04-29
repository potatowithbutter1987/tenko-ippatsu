import type { Vehicle, VehicleId } from "@/features/vehicle/types";
import { apiFetch } from "@/lib/api-client";

export const vehicleApi = {
  async getById(id: VehicleId): Promise<Vehicle | null> {
    return apiFetch<Vehicle | null>(`/api/vehicles/${id}`);
  },
};
