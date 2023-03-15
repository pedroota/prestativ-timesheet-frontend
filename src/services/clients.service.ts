import { Api } from "./api.service";
import { RegisterClients } from "interfaces/clients.interface";

export const getClients = async () => {
  const result = await Api.get("/clients");

  return result;
};

export const createClients = async ({
  corporateName,
  name,
  cnpj,
  cep,
  street,
  streetNumber,
  complement,
  district,
  city,
  state,
  periodIn,
  periodUntil,
  billingLimit,
  payDay,
  valueClient,
  gpClient,
  businessUnit,
}: RegisterClients) => {
  const result = await Api.post("/clients", {
    corporateName,
    name,
    cnpj,
    cep,
    street,
    streetNumber,
    complement,
    district,
    city,
    state,
    periodIn,
    periodUntil,
    billingLimit,
    payDay,
    valueClient,
    gpClient,
    businessUnit,
  });

  return result;
};

export const updateClient = async (
  id: string,
  {
    corporateName,
    name,
    cnpj,
    cep,
    street,
    streetNumber,
    complement,
    district,
    city,
    state,
    periodIn,
    periodUntil,
    billingLimit,
    payDay,
    valueClient,
    gpClient,
    businessUnit,
  }: RegisterClients
) => {
  const results = await Api.put(`/clients/${id}`, {
    corporateName,
    name,
    cnpj,
    cep,
    street,
    streetNumber,
    complement,
    district,
    city,
    state,
    periodIn,
    periodUntil,
    billingLimit,
    payDay,
    valueClient,
    gpClient,
    businessUnit,
  });

  return results;
};

export const getClientById = async (_id: string) => {
  const result = await Api.get(`/clients/${_id}`);

  return result;
};

export const deleteClient = async (_id: string) => {
  const result = await Api.delete(`/clients/${_id}`);

  return result;
};
