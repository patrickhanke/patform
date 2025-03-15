import { Dispatch, SetStateAction } from "react";

export type UserOverviewProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
