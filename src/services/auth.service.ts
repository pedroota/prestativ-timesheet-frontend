import { User, UserRegister, UserInfo } from "interfaces/users.interface";
import { Api } from "./api.service";

export const signin = async ({ email, password }: User) => {
  const result = await Api.post("/auth/login", {
    email,
    password,
  });

  return result;
};

export const getUserByRole = async (role: string = "Gerente-De-Projetos") => {
  const result = await Api.get(`/auth/users?role=${role}`);

  return result;
};

export const getAllUsers = async () => {
  const result = await Api.get("/auth/users");

  return result;
};

export const deleteUser = async (_id: string ) => {
  const result = await Api.delete(`/auth/users/${_id}`);

  return result;
};

export const signup = async ({
  name,
  surname,
  email,
  password,
  role,
}: UserRegister) => {
  const result = await Api.post("/auth/register", {
    name,
    surname,
    email,
    password,
    role,
  });

  return result;
};
