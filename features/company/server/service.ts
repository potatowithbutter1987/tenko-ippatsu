import "server-only";

import { companyRepository } from "@/features/company/server/repository";
import type { Company, CompanyId } from "@/features/company/types";

export const companyService = {
  async getById(id: CompanyId): Promise<Company | null> {
    return companyRepository.findById(id);
  },
};
