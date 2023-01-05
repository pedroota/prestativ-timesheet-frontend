import { User } from "interfaces/users.interface";
import { Api } from "./api.service";

export const signin = async ({ email, password }: User) => {
  const result = await Api.post("/auth/login", {
    email,
    password,
  });

  return result;
};
