import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { projects } from "@/db/schema";
import type { Project, ProjectId } from "@/features/project/types";

const toProject = (row: typeof projects.$inferSelect): Project => ({
  id: row.id,
  name: row.name,
  type: row.type,
  pickupLocation: row.pickupLocation,
  deliveryLocation: row.deliveryLocation,
  isActive: row.isActive,
});

export const projectRepository = {
  async findById(id: ProjectId): Promise<Project | null> {
    const [row] = await db.select().from(projects).where(eq(projects.id, id));
    return row ? toProject(row) : null;
  },
};
