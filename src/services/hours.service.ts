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

export const createHours = async ({
  initial,
  final,
  adjustment,
  relClient,
  relProject,
  relActivity,
  relUser,
  activityDesc,
}: RegisterHours) => {
  const result = await Api.post("/hours", {
    initial,
    final,
    adjustment,
    relClient,
    relProject,
    relActivity,
    relUser,
    activityDesc,
  });

  return result;
};

export const updateHours = async (
  id: string,
  {
    initial,
    final,
    adjustment,
    relClient,
    relProject,
    relActivity,
    relUser,
    releasedCall,
    activityDesc,
  }: UpdateHoursProps
) => {
  const result = await Api.put(`/hours/${id}`, {
    initial,
    final,
    adjustment,
    relClient,
    relProject,
    relActivity,
    relUser,
    releasedCall,
    activityDesc,
  });

  return result;
};

interface FormData {
  releasedCall: string;
}

export const updateReleasedCall = async (
  id: string,
  releasedCall: FormData
) => {
  const result = await Api.put(`/hours/${id}`, {
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
