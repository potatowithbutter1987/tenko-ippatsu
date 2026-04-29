import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { companies } from "@/db/schema";
import type { Company, CompanyId } from "@/features/company/types";

const toCompany = (row: typeof companies.$inferSelect): Company => ({
  id: row.id,
  name: row.name,
  tierLevel: row.tierLevel,
  isActive: row.isActive,
});

export const companyRepository = {
  async findById(id: CompanyId): Promise<Company | null> {
    const [row] = await db.select().from(companies).where(eq(companies.id, id));
    return row ? toCompany(row) : null;
  },
};
