import colors from "../../../../ui/src/general/Inputs/ColorSelect/constants/colors";
import { Image } from "./Application";

export type PatflowUserRoleTypes = "worker" | "office" | "admin";

export type PatflowUserRole = {
  objectId: string;
  name: string;
  type: PatflowUserRoleTypes;
  color: "primary" | "secondary" | "info" | "warning";
  users: {
    edges: { node: Pick<PatflowUser, "objectId", "username"> }[];
  };
  roles: {
    results: PatflowUserRole[];
  };
};

export type PatflowUser = {
  objectId: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  type: string;
  number: number;
  color: typeof colors[number]["value"];
  role: PatflowUserRole;
  is_worker: boolean;
  portrait: ParseImage | null;
  projects: string[];
  notification_settings: {[key: string]: boolean};
  label: string;
  data: {
    street: string;
    zip: string;
    city: string;
  }
};

export type PatflowUserDisplayData = Pick<
  PatflowUser,
  "objectId" | "last_name" | "first_name" | "email" | "portrait" | "color"
>;

export type CreatePatflowUser = Pick<
  PatflowUser,
  "last_name" | "first_name" | "email" | "portrait" | "color"
> & { password: string; repeat_password: string; role: string };
