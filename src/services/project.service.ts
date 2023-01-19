import { Api } from "./api.service";
import { Projects } from "interfaces/projects.interface";

export const getProjects = async () => {
  const result = await Api.get("/projects");

  return result;
};

export const createProjects = async ({
  title,
  idClient,
  valueProject,
  gpProject,
  description,
}: Projects) => {
  const result = await Api.post("/projects", {
    title,
    idClient,
    valueProject,
    gpProject,
    description,
  });

  return result;
};

export const getProjectById = async (_id: string) => {
  const result = await Api.get(`/projects/${_id}`);

  return result;
};

export const updateProjects = async (
  id: string,
  { title, idClient, valueProject, gpProject, description }: Projects
) => {
  const results = await Api.put(`/projects/${id}`, {
    title,
    idClient,
    valueProject,
    gpProject,
    description,
  });

  return results;
};

export const deleteProject = async (_id: string) => {
  const result = await Api.delete(`/projects/${_id}`);

  return result;
};
