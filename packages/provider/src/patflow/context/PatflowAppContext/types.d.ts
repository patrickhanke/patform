import {
	PatflowProject,
	PatflowUser,
	PatflowUserRoleTypes,
	Property,
	StaffMember
} from "@repo/types";
import { Dispatch } from "react";

export type dynamicItem = {
	value: string;
	label: string;
};

export type RoleUsers = {
	[Property in PatflowUserRoleTypes]: PatflowUser["objectId"][];
};

export type ContextValues = {
	refetchTicket: Date | undefined;
	refetchTask?: Date | undefined;
	setRefetchTicket: Dispatch<SetStateAction<Date | undefined>>;
	setRefetchTask: Dispatch<SetStateAction<Date | undefined>>;
	createTicket: JSX.Element;
	createTask: JSX.Element;
	selectYear: JSX.Element;
	year: number;
	workers: StaffMember[];
	properties: Property[];
	refetchWorkers: () => void;
	refetchProperties: () => void;
	roles: {
		value: string;
		type: string;
		label: string;
		color: string;
		users: { objectId: string; username: string }[];
	}[];
	project: PatflowProject;
	roleUsers: RoleUsers;
};

export type YearOptions = { value: number; label: string }[];

export type SelectYearProps = {
	year: number;
	setYear: (value: number) => void;
};
