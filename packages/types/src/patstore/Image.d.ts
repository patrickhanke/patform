import { ClassProperties } from "./Classes";

export type ImageClass = ClassProperties & {
  name: string;
  date: string;
  filePath: string;
  description: string;
  connected_elements: {value: string, label: string}[];
  file: {
    url: string;
    name: string;
  };
};
