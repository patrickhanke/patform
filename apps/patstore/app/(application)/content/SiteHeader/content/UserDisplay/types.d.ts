import { Dispatch, SetStateAction } from "react";
import { PatstoreUser } from "@repo/types";

export type UserDisplayProps = {
    userMessages?: boolean;
};

export type UserSettingsProps = {
    user: PatstoreUser;
    userSettings: boolean;
    setUserSettings: Dispatch<SetStateAction<boolean>>;
    getUser: () => Promise<void>;
}

export type ProjectSelectionProps = {
    projects: string[];
}