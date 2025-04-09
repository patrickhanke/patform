import { ClassProperties } from "./Classes";
import { EventDate } from "./Event";

export type DateClass = ClassProperties & {
  title: string;
  description: string;
  image: string;
  date: EventDate;
};
