import "server-only";

import { driverRepository } from "@/features/driver/server/repository";
import type {
  Driver,
  DriverId,
  DriverRegistrationInput,
} from "@/features/driver/types";

export const driverService = {
  async getById(id: DriverId): Promise<Driver | null> {
    return driverRepository.findById(id);
  },

  async register(input: DriverRegistrationInput): Promise<Driver> {
    return driverRepository.create(input);
  },
};
