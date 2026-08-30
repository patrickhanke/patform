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

export type ClubClass = ClassProperties & {
	title: string;
	contact?: string;
	email?: string;
	homepage?: string;
	logo?: string;
	short?: string;
	training: ClubTrainingTime[];
	playerIds: string[];
};
