import { Project } from "@repo/types";

export const findModuleFields = (path: string, project: Project) => {
  return project.modules.results.find((module) => module.path === path)?.fields;
};
