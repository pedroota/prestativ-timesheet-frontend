import { Api } from "./api.service";

export const getRoles = () => {
  const result = Api.get("/roles");

  return result;
};
