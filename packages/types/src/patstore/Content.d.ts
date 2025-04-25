import { ClassProperties } from "./Classes";

export type ContentClass = ClassProperties & {
  content: string;
  name: string;
  active: boolean;
};
