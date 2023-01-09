import { Api } from "./api.service";
import { Activities } from "interfaces/activities.interface";

export const getActivities = async () => {
  const result = await Api.get("/activities");

  return result;
};

export const createActivities = async ({
  title,
  project,
  valueActivity,
  gpActivity,
  description,
  userString,
}: Activities) => {
  const result = await Api.post("/activities", {
    title,
    project,
    valueActivity,
    gpActivity,
    description,
    userString,
  });

  return result;
};

export const deleteActivity = async (_id: string) => {
  const result = await Api.delete(`/activities/${_id}`);

  return result;
};
