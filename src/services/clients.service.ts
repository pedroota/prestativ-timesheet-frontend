import { Api } from "./api.service";
import { Clients } from "interfaces/clients.interface";

export const getClients = async () => {
  const result = await Api.get("/clients");

  return result;
};

export const createClients = async ({
  code,
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
}: Clients) => {
  const result = await Api.post("/clients", {
    code,
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
  });

  return result;
};

export const deleteClient = async (_id: string) => {
  const result = await Api.delete(`/clients/${_id}`);

  return result;
};
