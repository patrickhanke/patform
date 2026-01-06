import { ColorValues } from "@repo/ui";
import { ClassProperties, PatstoreProject } from "./Classes";
import { PatstoreUser } from "./User";

export type PatstoreRoleClass = ClassProperties & {
	name: string;
	label: string
	title: string;
	roles: {
		results: PatstoreRoleClass[];
	}
	users: {
		results: PatstoreUser[];
	}
	project: PatstoreProject;
	modules: string[];
	default: boolean;
	admin: boolean;
	color?: ColorValues;
}