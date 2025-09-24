import { PatflowUser, User } from "@repo/types";

export type Worker = {
  objectId: string;
  first_name: string;
  last_name: string;
  email: string;
  portrait: ApplicationTypes.Image;
  created_by?: User;
  time_settings?: User["time_settings"];
  data: PatflowUser["data"]
};

export type WorkerSelect = {
  value: string;
  id: string;
  label: string;
  portrait: ApplicationTypes.Image;
};
