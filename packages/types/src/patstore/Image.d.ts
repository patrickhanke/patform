import { ClassProperties } from "./Classes";

export type ImageClass = ClassProperties & {
  title: string;
  date: string;
  description: string;
  connected_elements: {value: string, label: string}[];
  file: {
    url: string;
    name: string;
  };
};
