import { Dispatch, SetStateAction } from "react";
import { ApolloRefetch } from "@repo/types";

export type AppUsersProps = {
    projectId: string;
    createUser: boolean;
    setCreateUser: Dispatch<SetStateAction<boolean>>;
    addUser: boolean;
    setAddUser: Dispatch<SetStateAction<boolean>>;
}


export type CreateUserProps = {
    user: UserObject,
    setUser: Dispatch<SetStateAction<UserObject | undefined>>
}

export type UserObject = {
    username: string,
    label: string,
    projects: string[],
    value: string
}

export type AddUserProps = {
    user?: UserObject,
    setUser: Dispatch<SetStateAction<UserObject | undefined>>,
    projectId: string
}