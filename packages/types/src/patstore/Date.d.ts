import { ClassProperties } from "./Classes";
import { EventDate } from "./Event";

export type AppointmentClass = ClassProperties & {
  title: string;
  description: string;
  image: string;
  date: EventDate;
};
