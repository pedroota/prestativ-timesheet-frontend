import { AxiosResponse } from "axios";
import { User, UserDataLogIn, UserRegister } from "interfaces/users.interface";
import { Api } from "./api.service";

export const signin = async ({
  email,
  password,
}: User): Promise<AxiosResponse<UserDataLogIn>> => {
  const result = await Api.post("/auth/login", {
    email,
    password,
  });

  return result;
};

export const getUserByRole = async (role: string) => {
  const result = await Api.get(`/auth/users?role=${role}`);

  return result;
};

export const getUserById = async (id: string) => {
  const result = await Api.get(`/auth/users/${id}`);

  return result;
};

export const getAllUsers = async () => {
  const result = await Api.get("/auth/users");

  return result;
};

export const deleteUser = async (_id: string) => {
  const result = await Api.delete(`/auth/users/${_id}`);

  return result;
};

export const updateUser = async (
  _id: string | undefined,
  { name, surname, email, password, role, typeField }: UserRegister
) => {
  const result = await Api.put(`/auth/users/${_id}`, {
    name,
    surname,
    email,
    password,
    role,
    typeField,
  });

  return result;
};

export const signup = async ({
  name,
  surname,
  email,
  password,
  role,
  typeField,
}: UserRegister) => {
  const result = await Api.post("/auth/register", {
    name,
    surname,
    email,
    password,
    role,
    typeField,
  });
  return result;
};

export const forgot = async (email: string) => {
  const result = await Api.post("/auth/forgot", {
    email,
  });

  return result;
};

export const newpass = async ({ email, password, token }: UserRegister) => {
  const result = await Api.post("/auth/newpass", {
    email,
    password,
    token,
  });
  return result;
};
