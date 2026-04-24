import { Dispatch, SetStateAction } from "react";
import { ApolloRefetch, Module, PatstoreRoleClass } from "@repo/types";

export type ProjectRolesProps = {
	projectId: string;
	projectPath: string;
	createRole: boolean;
	setCreateRole: Dispatch<SetStateAction<boolean>>;
	modules: Module[];
};

export type CreateRoleProps = {
	role: { name: string };
	setRole: Dispatch<SetStateAction<{ name: string }>>;
};

export type SelectRoleModulesProps = {
	roleId: string;
	modules: Module[];
	initialModules: string[];
};

export type DefaultRoleProps = {
	roleId: string;
	roles: PatstoreRoleClass[];
	refetch: ApolloRefetch;
};

export type AdminRoleProps = {
	roleId: string;
	roles: PatstoreRoleClass[];
	refetch: ApolloRefetch;
	projectId: string;
};

export type UseRoleColumnsProps = {
	modules: Module[];
	roles: PatstoreRoleClass[];
	refetch: ApolloRefetch;
	projectId: string;
};
