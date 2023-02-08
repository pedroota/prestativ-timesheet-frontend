export interface Clients {
  code: string;
  name: string;
  cnpj: string;
  cep: string;
  street: string;
  streetNumber: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  periodIn: number;
  periodUntil: number;
  billingLimit: string;
  payDay: number;
  valueClient: number;
  gpClient: {
    _id: string;
    name: string;
    surname: string;
  };
}

export interface RegisterClients {
  code: string;
  name: string;
  cnpj: string;
  cep: string;
  street: string;
  streetNumber: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  periodIn: number;
  periodUntil: number;
  billingLimit: string;
  payDay: number;
  valueClient: number;
  gpClient: string;
}

export interface ClientsInfo {
  _id: string;
  code: string;
  name: string;
  cnpj: string;
  cep: string;
  street: string;
  streetNumber: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  createdAt: number;
  updatedAt: number;
  periodIn: number;
  periodUntil: number;
  billingLimit: string;
  payDay: number;
  valueClient: number;
  gpClient: {
    _id: string;
    name: string;
    surname: string;
  };
}
