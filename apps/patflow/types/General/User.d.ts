import { Image } from "./Application";

export type UserRoleTypes = "worker" | "office" | "admin";

export type UserRole = {
  objectId: string;
  name: string;
  type: UserRoleTypes;
  color: "primary" | "secondary" | "info" | "warning";
  users: {
    results: Pick<User, "objectId", "username">[];
  };
  roles: {
    results: UserRole[];
  };
};

export type User = {
  objectId: string;
  email: string;
  username: string;
  first_name: string;
  family_name: string;
  is_superuser: boolean;
  type: string;
  color: string;
  role: UserRole;
  is_worker: boolean;
  portrait: Image;
};

export type UserDisplayData = Pick<
  User,
  "objectId" | "family_name" | "first_name" | "email" | "portrait" | "color"
>;

export type CreateUser = Pick<
  User,
  "family_name" | "first_name" | "email" | "portrait" | "color"
> & { password: string; repeat_password: string; role: string };
