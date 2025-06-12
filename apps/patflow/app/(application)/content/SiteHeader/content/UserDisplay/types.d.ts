import { Dispatch, SetStateAction } from "react";
import { PatflowUser } from "@repo/types";

export type UserDisplayProps = {
  userMessages?: boolean;
};

export type UserSettingsProps = {
  user: PatflowUser;
  userSettings: boolean;
  setUserSettings: Dispatch<SetStateAction<boolean>>;
  getUser: () => Promise<void>;
};

export type UserPasswordProps = {
  user: PatflowUser;
  userPassword: boolean;
  setUserPassword: Dispatch<SetStateAction<boolean>>;
};

export type ProjectSelectionProps = {
  projects: string[];
  selectProject: boolean;
  setSelectProject: Dispatch<SetStateAction<boolean>>;
};
