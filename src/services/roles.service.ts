import { Roles } from "interfaces/roles.interface";
import { Api } from "./api.service";

export const getRoles = async () => {
  const result = await Api.get("/roles");

  return result;
};

export const getRoleById = async (_id: string) => {
  const result = await Api.get(`/roles/${_id}`);

  return result;
};

export const createRoles = async ({
  name,
  permissions,
}: Pick<Roles, "name" | "permissions">) => {
  const result = await Api.post("/roles", { name, permissions });

  return result;
};

export const updateRoles = async (
  id: string,
  { name, permissions }: Pick<Roles, "name" | "permissions">
) => {
  const result = await Api.put(`/roles/${id}`, {
    name,
    permissions,
  });

  return result;
};

export const deleteRole = async (_id: string) => {
  const result = await Api.delete(`/roles/${_id}`);

  return result;
};
