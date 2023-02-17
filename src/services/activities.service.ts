import { Api } from "./api.service";
import { RegisterActivity } from "interfaces/activities.interface";

export const getActivities = async () => {
  const result = await Api.get("/activities");

  return result;
};

export const getActiveActivities = async () => {
  const result = await Api.get("/active/activities");

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
  activityValidity,
}: RegisterActivity) => {
  const result = await Api.post("/activities", {
    title,
    project,
    valueActivity,
    gpActivity,
    description,
    users,
    closedScope,
    activityValidity,
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
    activityValidity,
  }: RegisterActivity
) => {
  const result = await Api.put(`/activities/${id}`, {
    title,
    project,
    description,
    gpActivity,
    users,
    closedScope,
    valueActivity,
    activityValidity,
  });

  return result;
};

export const updateClosedEscope = async (_id: string, value: boolean) => {
  const result = await Api.patch(`/activities/closedscope/${_id}`, { value });

  return result;
};

export const updateActivityValidity = async (_id: string, value: number) => {
  const result = await Api.patch(`/active/activities/${_id}`, { value });

  return result;
};
