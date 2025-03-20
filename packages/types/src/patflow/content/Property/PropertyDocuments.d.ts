import { Dispatch, SetStateAction } from "react";

export type CreateDocumentComponent = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  createDocumentHandler: ({ user: string, name: string, file: File }) => void;
};
