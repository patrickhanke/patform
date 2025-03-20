import { RoleUsers } from "@provider";
import { CreateUser, ErrorMessage, User, UserRole } from "@repo/types";
import { Worker } from "@types";
import { DraftFunction, ImmerHook, Updater } from "use-immer";

type EditUser = User & { repeat_password: string };

export type CreateStaffMemberProps = {
  workers: Worker[];
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  refetch: () => void;
};

export type EditStaffDataProps = {
  staffMember: StaffMember;
  setStaffMember: Updater<CreateUser>;
  errors: ErrorMessage[];
  roles: UserRole[];
};

export type EditStaffSecondaryDataProps = {
  staffMember: StaffMember;
  setStaffMember: Updater<CreateUser>;
};

export type RoleSelect = {
  id: string;
  value: string;
  label: string;
};
