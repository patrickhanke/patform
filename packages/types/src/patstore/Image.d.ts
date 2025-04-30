import { ClassProperties } from "./Classes";

export type ImageClass = ClassProperties & {
  name: string;
  date: string;
  filePath: string;
  description: string;
};
