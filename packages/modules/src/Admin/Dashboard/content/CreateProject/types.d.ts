import { Dispatch, SetStateAction } from "react";

export type CreateProjectProps = {
  createProject: boolean;
  setCreateProject: Dispatch<SetStateAction<boolean>>;
};
