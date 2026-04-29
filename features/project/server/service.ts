import "server-only";

import { projectRepository } from "@/features/project/server/repository";
import type { Project, ProjectId } from "@/features/project/types";

export const projectService = {
  async getById(id: ProjectId): Promise<Project | null> {
    return projectRepository.findById(id);
  },
};
