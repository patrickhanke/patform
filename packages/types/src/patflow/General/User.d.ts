import { Image } from "./Application";

export type PatflowUserRoleTypes = "worker" | "office" | "admin";

export type PatflowUserRole = {
  objectId: string;
  name: string;
  type: PatflowUserRoleTypes;
  color: "primary" | "secondary" | "info" | "warning";
  users: {
    results: Pick<PatflowUser, "objectId", "username">[];
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
  family_name: string;
  is_superuser: boolean;
  type: string;
  color: string;
  role: PatflowUserRole;
  is_worker: boolean;
  portrait: Image;
};

export type PatflowUserDisplayData = Pick<
  PatflowUser,
  "objectId" | "family_name" | "first_name" | "email" | "portrait" | "color"
>;

export type CreatePatflowUser = Pick<
  PatflowUser,
  "family_name" | "first_name" | "email" | "portrait" | "color"
> & { password: string; repeat_password: string; role: string };
