import type {
  Driver,
  DriverId,
  DriverRegistrationInput,
} from "@/features/driver/types";
import { apiFetch } from "@/lib/api-client";

export const driverApi = {
  async register(input: DriverRegistrationInput): Promise<Driver> {
    return apiFetch<Driver>("/api/drivers", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async getById(id: DriverId): Promise<Driver | null> {
    return apiFetch<Driver | null>(`/api/drivers/${id}`);
  },
};
