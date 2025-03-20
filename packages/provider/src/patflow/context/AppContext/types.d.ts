import { UserTypes } from "@types";

export type dynamicItem = {
  value: string;
  label: string;
};

export type RoleUsers = {
  [Property in UserTypes.UserRoleTypes]: UserTypes.User["objectId"][];
};

export type ContextValues = {
  refetchTicket: Date | undefined;
  refetchTask?: Date | undefined;
  createTicket: JSX.Element;
  createTask: JSX.Element;
  selectYear: JSX.Element;
  year: number;
  roles: {
    value: string;
    type: string;
    label: string;
    color: string;
    users: { objectId: string; username: string }[];
  }[];
  roleUsers: RoleUsers;
};

export type YearOptions = { value: number; label: string }[];

export type SelectYearProps = {
  year: number;
  setYear: (value: number) => void;
};
