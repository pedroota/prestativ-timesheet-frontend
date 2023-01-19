import { Api } from "./api.service";
import { RegisterHours } from "interfaces/hours.interface";

export const getHours = async () => {
  const result = await Api.get("/hours");

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
  callNumber,
}: RegisterHours) => {
  const result = await Api.post("/hours", {
    initial,
    final,
    adjustment,
    relClient,
    relProject,
    relActivity,
    relUser,
    callNumber,
  });

  return result;
};

export const deleteHours = async (_id: string) => {
  const result = await Api.delete(`/hours/${_id}`);

  return result;
};
