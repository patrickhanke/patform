import { ClassProperties } from "./Classes";

export type VideoClass = ClassProperties & {
	path: "/videos";
    title: string;
    video: string;
    active: boolean;
};