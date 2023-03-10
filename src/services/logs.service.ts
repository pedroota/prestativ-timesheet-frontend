import { Api } from "./api.service";

export const getLogs = async () => {
  const result = await Api.get("/logs");

  return result;
};
