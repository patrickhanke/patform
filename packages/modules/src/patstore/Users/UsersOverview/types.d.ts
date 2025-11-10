import { Dispatch, SetStateAction } from "react";
import { ApolloRefetch, PatstoreUser } from "@repo/types";

export type UsersOverviewProps = {
	projectId: string;
	createUser: boolean;
	setCreateUser: Dispatch<SetStateAction<boolean>>;
	addUser: boolean;
	setAddUser: Dispatch<SetStateAction<boolean>>;
};

export type CreateUserProps = {
	user: UserObject;
	setUser: Dispatch<SetStateAction<UserObject | undefined>>;
};

export type UserObject = {
	username: string;
	projects: string[];
	value: string;
	name: string;
	role: string;
};

export type DeleteUserProps = {
	username: string;
	userId: string;
	email: string;
	refetch: ApolloRefetch;
};

export type AddUserProps = {
	user?: UserObject;
	setUser: Dispatch<SetStateAction<UserObject | undefined>>;
	projectId: string;
};

export type FilterArray = Filter[];

export type UseFindUser = ({
	filters: FilterArray,
	skip: number,
	limit: number
}) => {
	loading: boolean;
	users?: PatstoreUser[];
	refetch: ApolloRefetch;
	count: number;
};
