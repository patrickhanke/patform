import { ApolloError } from "@apollo/client";
import { PatstoreRoleClass } from "@repo/types";

export type ContextValues = {
	project: PatstoreContext | undefined;
	loadProject: (projectId: string) => void;
	roles: PatstoreRoleClass[];
};

export type ProjectLoaderProps = {
	loading: boolean;
	error?: ApolloError;
	project?: PatstoreContext | undefined;
	appId: string;
};

export type UseFindRolesHook = (T: { appId: string; projectId?: string }) => {
	roles: PatstoreRoleClass[];
	rolesError: ApolloError | undefined;
	rolesLoading: boolean;
};
