import { ClassProperties } from "./Classes";

export type GroupClass = ClassProperties & {
  title: string;
  image: string;
  state: string;
  contact: string;
  info: string;
  description: string;
  persons: string[];
  times: EventTime[];
  team?: Team;
};

export type Team = {
  id: string,
  image: string,
  name: string,
  description: string,
}
