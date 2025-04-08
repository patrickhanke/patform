import { IconTypes } from "../Icon";
import { TypeSelection } from "./types.d";
import { UserTypes } from "@repo/types";

type Options<T> = T extends "Absence"
	? typeof absence_state_options
	: T extends "Task"
		? typeof task_state_options
		: T extends "AbsenceType"
			? typeof absence_type_options
			: T extends "Role"
				? UserTypes.UserRole
				: T extends "DayTime"
					? typeof daytime_state_options
					: T extends "TicketState"
						? typeof ticket_state_options
						: never;

export type CustomOptions = {
	value: string;
	label: string;
	color?: string;
	onClick: () => void;
	disabled?: boolean;
}[];

export type UseGetState = <T extends TypeSelection>(
	type: T,
	state: State<T>,
	roles: UserTypes.UserRole[]
) => {
	stateObject: Options<T>[number];
	options: Options<T>;
};

export type State = {
	value: string | object | number;
	id?: string;
	label: string;
	color?: string;
};

export type StateSelect = {
	color?: string;
	icon?: IconTypes;
	displayInterface?: boolean;
	stateSelectHandler?: (state: State["value"]) => void | Promise<void>;
	noBackground?: boolean;
	onClick?: () => void;
	width?: number | string;
	type: "label";
	state?: null;
	stateOptions?: null;
	label: string;
	customOptions?: CustomOptions;
};

export type StateSelectProps = {
	color?: string;
	icon?: IconTypes;
	noBackground?: boolean;
	width?: number | string;
	label: string;
	customOptions?: CustomOptions;
};

export type UseGetState = (T: { state: State; states: State[] }) => {
	stateObject: State;
	options: State[];
};
