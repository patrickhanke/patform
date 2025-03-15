import { ClassProperties } from "./Classes";

export type CategoryClass = ClassProperties & {
  name: string;
  image: string;
  icon: string;
  connected_class: string;
  key: string;
  description: string;
};
