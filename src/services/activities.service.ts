import { Api } from "./api.service";
import { Activities } from "interfaces/activities.interface";

export const getActivities = async () => {
  const result = await Api.get("/activities");

  return result;
};

export const getActivityById = async (id: string) => {
  const result = await Api.get(`/activities/${id}`);

  return result;
};

export const createActivities = async ({
  title,
  project,
  valueActivity,
  gpActivity,
  description,
  users,
  closedScope,
}: Activities) => {
  const result = await Api.post("/activities", {
    title,
    project,
    valueActivity,
    gpActivity,
    description,
    users,
    closedScope,
  });

  return result;
};

export const deleteActivity = async (_id: string) => {
  const result = await Api.delete(`/activities/${_id}`);

  return result;
};

export const updateActivity = async (
  id: string,
  {
    title,
    project,
    description,
    gpActivity,
    users,
    closedScope,
    valueActivity,
  }: Activities
) => {
  const result = await Api.put(`/activities/${id}`, {
    title,
    project,
    description,
    gpActivity,
    users,
    closedScope,
    valueActivity,
  });

  return result;
};

export const updateClosedEscope = async (_id: string, value: boolean) => {
  const result = await Api.patch(`/activities/closedscope/${_id}`, { value });

  return result;
};
