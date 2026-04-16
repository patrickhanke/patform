export type IconTypes =
	| "clock"
	| "task"
	| "info"
	| "archive"
	| "plus"
	| "house"
	| "calendar"
	| "arrow-down"
	| "arrow-up"
	| "ticket"
	| "weeks"
	| "check"
	| "add"
	| "circle-check"
	| "circle"
	| "circle-user-round";

export type IconProps = {
	type: IconTypes;
	size?: number;
	strokeWidth?: number;
	color?: string;
};
