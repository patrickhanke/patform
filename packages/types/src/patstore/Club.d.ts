import { ClassProperties } from "./Classes";

export type ClubTrainingTime = {
	id: string;
	title: string;
	weekday: string;
	startHours: number | null;
	startMinutes: number | null;
	endHours: number | null;
	endMinutes: number | null;
	contact?: boolean;
	groupIds: string[];
	gymId?: string;
};

export type ClubFile = {
	__type?: "File";
	name?: string;
	url?: string;
};

export type ClubSettings = {
	short?: string;
};

export type ClubClass = ClassProperties & {
	title: string;
	contact?: string;
	email?: string;
	homepage?: string;
	/** Logo. Former `logo`. */
	file?: ClubFile | null;
	/** `short` is the club abbreviation. */
	settings?: ClubSettings;
	training: ClubTrainingTime[];
	playerIds: string[];
};
