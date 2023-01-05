import { Api } from "./api.service";

export const getRoles = async () => {
  const result = await Api.get("/roles");

  return result;
};
