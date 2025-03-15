import { Dispatch, SetStateAction } from "react";

export type CreateDocumentProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  createDocumentHandler: ({ user: string, name: string, file: File }) => void;
};
