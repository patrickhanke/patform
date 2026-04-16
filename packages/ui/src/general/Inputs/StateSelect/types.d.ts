import { IconTypes } from "@repo/ui";
import { ClassState, UserTypes } from "@repo/types";

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

export type State =
	| ClassState
	| { value: string; label: string; color?: string };

export type StateSelectProps<S> = {
	color?: string;
	icon?: IconTypes;
	isDisabled?: boolean;
	stateSelectHandler?: (state: S[number]) => void | Promise<void>;
	noBackground?: boolean;
	onClick?: () => void;
	width?: number | string;
	type: "state";
	label?: null;
	state: State["value"];
	stateOptions: State[];
	customOptions?: null;
};

export type UseGetState = (T: { state: State; states: State[] }) => {
	stateObject: State;
	options: State[];
};
