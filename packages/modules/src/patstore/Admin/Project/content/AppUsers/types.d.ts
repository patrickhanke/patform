import { Dispatch, SetStateAction } from "react";
import { ApolloRefetch, PatstoreRoleClass, PatstoreUser } from "@repo/types";

export type AppUsersProps = {
	projectId: string;
	createUser: boolean;
	setCreateUser: Dispatch<SetStateAction<boolean>>;
	addUser: boolean;
	setAddUser: Dispatch<SetStateAction<boolean>>;
};

export type CreateUserProps = {
	user: UserObject;
	setUser: Dispatch<SetStateAction<UserObject>>;
	roles: PatstoreRoleClass[];
};

export type UserObject = {
	username: string;
	label: string;
	projects: string[];
	value: string;
	name: string;
	role: { value: string; label: string };
};

export type UseUserColumnsProps = {
	roles: PatstoreRoleClass[];
	refetch: ApolloRefetch;
};

export type AddUserProps = {
	user?: UserObject;
	setUser: Dispatch<SetStateAction<UserObject>>;
	projectId: string;
	roles: PatstoreRoleClass[];
};

export type SelectUserRoleProps = {
	user: PatstoreUser;
	roles: PatstoreRoleClass[];
	refetch: ApolloRefetch;
};
