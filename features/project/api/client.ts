import type { Project, ProjectId } from "@/features/project/types";
import { apiFetch } from "@/lib/api-client";

export const projectApi = {
  async getById(id: ProjectId): Promise<Project | null> {
    return apiFetch<Project | null>(`/api/projects/${id}`);
  },
};
