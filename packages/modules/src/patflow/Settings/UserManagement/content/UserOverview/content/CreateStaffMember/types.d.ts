import { ApolloRefetch, ErrorMessage, PatflowUser } from "@repo/types";
import { Role } from "@repo/provider";
import { Updater } from "use-immer";

export type NewStaffMemberForm = Pick<
	PatflowUser,
	"first_name" | "last_name" | "email" | "color"
> & {
	password: string;
	repeat_password: string;
	roles: string[];
};

export type CreateStaffMemberProps = {
	users: PatflowUser[];
	setIsOpen: (isOpen: boolean) => void;
	isOpen: boolean;
	refetch: ApolloRefetch;
};

export type EditStaffDataProps = {
	staffMember: NewStaffMemberForm;
	setStaffMember: Updater<NewStaffMemberForm>;
	errors: ErrorMessage[];
	roles: Role[];
};

export type EditStaffSecondaryDataProps = {
	staffMember: NewStaffMemberForm;
	setStaffMember: Updater<NewStaffMemberForm>;
};

export type RoleSelect = {
	id: string;
	value: string;
	label: string;
};
