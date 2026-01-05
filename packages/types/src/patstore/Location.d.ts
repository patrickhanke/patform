import { MapPlace } from "@repo/ui";
import { ClassProperties } from "./Classes";

export type LocationClass = ClassProperties & {
  image: string;
  title: string;
  address: string;
  coordinates: MapPlace;
  description: string;
};
