import { LatitudeLongitude } from "@repo/ui";
import { ClassProperties } from "./Classes";

export type EventLocation = {
  type: "address" | "map" | "online" | "location";
  address?: string;
  map?: LatitudeLongitude | null;
  online?: string;
  location?: string;
};

export type EventDate = {
  label: string;
  start: string;
  end: string;
  place: EventLocation;
  full_day: boolean;
  id: string;
  text: string;
};

export type EventTime = {
  weekday: string;
  start: string;
  end: string;
  place: EventLocation;
  id: string;
};

export type EventClass = ClassProperties & {
  title: string;
  dates: EventDate[];
  location: string;
  description: string;
  image: string;
};
