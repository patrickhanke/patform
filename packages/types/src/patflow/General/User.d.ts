import colors from "../../../../ui/src/general/Inputs/ColorSelect/constants/colors";

export type PatflowUserRoleTypes = "worker" | "office" | "admin";

export type PatflowUserRole = {
	objectId: string;
	name: string;
	type: PatflowUserRoleTypes;
	color: "primary" | "secondary" | "info" | "warning";
	users: {
		edges: { node: Pick<PatflowUser, "objectId", "username"> }[];
	};
	roles: {
		results: PatflowUserRole[];
	};
};

export type PatflowUser = {
	objectId: string;
	updatedAt: string;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	is_superuser: boolean;
	type: string;
	color: (typeof colors)[number]["value"];
	settings: {
		is_worker: boolean;
		notification_settings: { [key: string]: boolean };
	};
	portrait: {
		url: string;
		name: string;
	};
	roles: string[];
	projects: string[];
	label: string;
	data: {
		street: string;
		zip: string;
		city: string;
	};
};

export type PatflowUserDisplayData = Pick<
	PatflowUser,
	"objectId" | "last_name" | "first_name" | "email" | "portrait" | "color"
>;

export type CreatePatflowUser = Pick<
	PatflowUser,
	"last_name" | "first_name" | "email" | "portrait" | "color"
> & { password: string; repeat_password: string; role: string };
