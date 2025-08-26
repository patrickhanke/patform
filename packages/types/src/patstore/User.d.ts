import { ApplicationTypes } from ".";

export type PatstoreUserRole = {
  objectId: string;
  name: strting;
  color: "primary" | "secondary" | "info" | "warning";
  users: {
    results: Pick<PatstoreUser, "objectId", "username">[];
  };
  roles: {
    results: PatstoreUserRole[];
  };
};

export type PatstoreUser = {
  label: string;
  objectId: string;
  email: string;
  username: string;
  is_superuser: boolean;
  type: string;
  name: string;
  role: PatstoreUserRole;
  portrait: {
    url: string;
    name: string;
  };
  password: string;
  projects: string[];
  roles: string[];
};
