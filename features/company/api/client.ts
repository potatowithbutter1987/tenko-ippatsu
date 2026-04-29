import type { Company, CompanyId } from "@/features/company/types";
import { apiFetch } from "@/lib/api-client";

export const companyApi = {
  async getById(id: CompanyId): Promise<Company | null> {
    return apiFetch<Company | null>(`/api/companies/${id}`);
  },
};
