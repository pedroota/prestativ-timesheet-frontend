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
