import { ColorValues } from "@repo/ui";
import { ClassProperties, PatstoreProject } from "./Classes";
import { PatstoreUser } from "./User";

export type PatstoreRoleClass = ClassProperties & {
	name: string;
	label: string
	title: string;
	roles: {
		edges: { node: PatstoreRoleClass }[];
	}
	users: {
		edges: { node: PatstoreUser }[];
	}
	project: PatstoreProject;
	modules: string[];
	default: boolean;
	admin: boolean;
	color?: ColorValues;
}