import { Dispatch, SetStateAction } from "react";

export type SiteHeaderComponent = {
  title?: string;
};

export type AddProjectProps = {
  addProject: boolean;
  setAddProject: Dispatch<SetStateAction<boolean>>;
};
