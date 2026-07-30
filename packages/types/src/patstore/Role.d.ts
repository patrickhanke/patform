import { ColorValues } from "@repo/ui";
import { ClassProperties } from "./Classes";

import { PatstoreUser } from "./User";
import { PatstoreProject } from "./Project";

export type PatstoreRoleClass = ClassProperties & {
	name: string;
	label: string;
	title: string;
	roles: {
		edges: { node: PatstoreRoleClass }[];
	};
	users: {
		edges: { node: PatstoreUser }[];
	};
	project: PatstoreProject;
	modules: string[];
	default: boolean;
	admin: boolean;
	color?: ColorValues;
};
