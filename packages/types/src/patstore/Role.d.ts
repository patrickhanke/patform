import { ColorValues } from "@repo/ui";
import { ClassProperties } from "./Classes";

import { PatstoreUser } from "./User";
import { PatstoreProject } from "./Project";
import type { Module } from "./Module";

/** One record this role may open, such as a single club, without the whole module. */
export type PatstoreRoleAccess = {
	id: string;
	className: Module["connected_class"];
	expires_at: string | null;
};

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
	/** Record grants. Replaces per-user access. */
	access?: PatstoreRoleAccess[];
	default: boolean;
	admin: boolean;
	color?: ColorValues;
};
