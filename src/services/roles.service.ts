import { Api } from "./api.service";

export const getRoles = async () => {
  const result = await Api.get("/roles");

  return result;
};

export const deleteRole = async (_id: string) => {
  const result = await Api.delete(`/roles/${_id}`);

  return result;
};
