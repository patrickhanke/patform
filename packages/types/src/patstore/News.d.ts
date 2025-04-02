import { ClassProperties } from "./Classes";

export type NewsClass = ClassProperties & {
  title: string;
  image: string;
  text: string;
  author: string;
  date: string;
};
