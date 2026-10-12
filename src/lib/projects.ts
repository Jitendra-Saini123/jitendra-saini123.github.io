import type { Project, ProjectFilter } from "@/types";

export const projectFilters: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mobile", label: "Mobile" },
  { id: "web", label: "Web" },
  { id: "game", label: "Games" },
];

export function matchesFilter(project: Project, filter: ProjectFilter): boolean {
  return filter === "all" || project.platforms.includes(filter);
}

export function filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
  return projects.filter((project) => matchesFilter(project, filter));
}

export function countByFilter(projects: Project[]): Record<ProjectFilter, number> {
  return {
    all: projects.length,
    mobile: filterProjects(projects, "mobile").length,
    web: filterProjects(projects, "web").length,
    game: filterProjects(projects, "game").length,
  };
}
