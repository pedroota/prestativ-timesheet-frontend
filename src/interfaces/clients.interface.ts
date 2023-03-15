export interface Clients {
  corporateName: string;
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
  gpClient: [
    {
      _id: string;
      name: string;
      surname: string;
    }
  ];
  businessUnit?: string;
}

export interface RegisterClients {
  corporateName: string;
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
  gpClient: [
    {
      _id: string;
      name: string;
      surname: string;
    }
  ];
  businessUnit?: string;
}

export interface ClientsInfo {
  _id: string;
  corporateName: string;
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
  gpClient: [
    {
      _id: string;
      name: string;
      surname: string;
    }
  ];
  businessUnit?: {
    _id: string;
    nameBU: string;
    relUser: string;
  };
}
