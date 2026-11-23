import { ClassProperties } from "../patstore/Classes";

export type ParseFileValue = {
	__type?: "File";
	name: string;
	url: string;
};

export type ClubSettings = {
	contact?: string;
	email?: string;
	homepage?: string;
	short?: string;
	/** Spielgemeinschaft only: objectId of the leading regular club. */
	primary_club_id?: string;
	/** Spielgemeinschaft only: objectId of the second regular club. */
	secondary_club_id?: string;
};

export type PrellballTrainingTime = {
	id: string;
	title: string;
	weekday: string;
	start_hours: number | null;
	start_minutes: number | null;
	end_hours: number | null;
	end_minutes: number | null;
	contact?: boolean;
	/** Division category objectIds. */
	classes: string[];
	location_id?: string;
};

export type ClubData = {
	training_times: PrellballTrainingTime[];
};

/** Prellball club. Season is not stored here; players point at the club via Person.categories. */
export type PrellballClubClass = Omit<ClassProperties, "data"> & {
	title: string;
	file?: ParseFileValue | null;
	settings: ClubSettings;
	data: ClubData;
};
