import { Api } from "./api.service";
import {
  BusinessUnit,
  BusinessUnitRegister,
} from "interfaces/business.interface";

export const getBusiness = async () => {
  const result = await Api.get("/business");

  return result;
};

export const createBusiness = async ({ nameBU, relUser }: BusinessUnit) => {
  const result = await Api.post("/business", {
    nameBU,
    relUser,
  });

  return result;
};

export const getBusinessById = async (_id: string) => {
  const result = await Api.get(`/business/${_id}`);

  return result;
};

export const updateBusiness = async (
  id: string,
  { nameBU, relUser }: BusinessUnitRegister
) => {
  const results = await Api.put(`/business/${id}`, {
    nameBU,
    relUser,
  });

  return results;
};

export const deleteBusiness = async (_id: string) => {
  const result = await Api.delete(`/business/${_id}`);

  return result;
};
