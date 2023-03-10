import { Api } from "./api.service";
import { RegisterHours, UpdateHoursProps } from "interfaces/hours.interface";

export const getHours = async () => {
  const result = await Api.get("/hours");
  return result;
};

export const getHoursLatest = async () => {
  const result = await Api.get("/hours/latest");
  return result;
};

export const getHoursFilters = async (filters: string) => {
  const result = await Api.get(`/hours/filter?${filters}`);
  return result;
};

export const getHoursById = async (_id: string) => {
  const result = await Api.get(`/hours/${_id}`);

  return result;
};

export const getHoursByUser = async (_id: string) => {
  const result = await Api.get(`/hours/user/${_id}`);

  return result;
};

export const createHours = async (data: RegisterHours) => {
  const result = await Api.post("/hours", { ...data });

  return result;
};

// DATA abaixo deve ser um objeto
export const updateHours = async (id: string, data: UpdateHoursProps) => {
  const result = await Api.put(`/hours/${id}`, { ...data });

  return result;
};

export const updateDataRow = async (id: string, data: any) => {
  const result = await Api.put(`/hours/${id}`, data);

  return result;
};

export const updateReleasedCall = async (id: string, releasedCall: string) => {
  const result = await Api.patch(`/hours/releasedcall/${id}`, {
    releasedCall,
  });

  return result;
};

export const deleteHours = async (_id: string) => {
  const result = await Api.delete(`/hours/${_id}`);

  return result;
};

export const checkHours = async (id: string, field: string, value: boolean) => {
  const result = await Api.patch(`/hours/check/${id}`, {
    field,
    value,
  });

  return result;
};
