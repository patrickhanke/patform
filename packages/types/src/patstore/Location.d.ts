import { ClassProperties } from "./Classes";

export type MapPlace = {
	latitude: number;
	longitude: number;
};

export type LocationClass = ClassProperties & {
	image: string;
	title: string;
	address: string;
	coordinates: MapPlace;
	description: string;
};
