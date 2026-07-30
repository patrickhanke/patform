import { Dispatch, SetStateAction } from "react";
import { ApolloRefetch, PatstoreUser } from "@repo/types";
import { Field } from "@repo/ui";

export type UsersOverviewProps = {
	projectId: string;
	createUser: boolean;
	setCreateUser: Dispatch<SetStateAction<boolean>>;
	addUser: boolean;
	setAddUser: Dispatch<SetStateAction<boolean>>;
};

export type CreateUserProps = {
	user: PatstoreUser;
	setUser: Dispatch<SetStateAction<PatstoreUser | undefined>>;
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

export type CreateUser = {
	[key: string]: {
		fields: Field[];
		data: Partial<PatstoreUser>;
	};
};

export type EmailSuppressionProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	projectId: string;
};
