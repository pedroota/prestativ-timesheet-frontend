import { Api } from "./api.service";
import { RegisterHours, Hours } from "interfaces/hours.interface";

export const getHours = async () => {
  const result = await Api.get("/hours");

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
    approvedGP,
    billable,
    released,
    approved,
    activityDesc,
  }: Hours
) => {
  const result = await Api.put(`/hours/${id}`, {
    initial,
    final,
    adjustment,
    relClient,
    relProject,
    relActivity,
    relUser,
    approvedGP,
    billable,
    released,
    approved,
    activityDesc,
  });

  return result;
};

export const deleteHours = async (_id: string) => {
  const result = await Api.delete(`/hours/${_id}`);

  return result;
};
