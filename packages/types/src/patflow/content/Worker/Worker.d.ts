import { PatflowUser, PatflowUserRole, User } from "@repo/types";

export type Worker = {
	color: string;
	settings: {
		is_worker: boolean;
		time_settings: string;
	};
	number: string;
	role: PatflowUserRole;
	value: string;
	label: string;
	objectId: string;
	first_name: string;
	last_name: string;
	email: string;
	portrait: {
		url: string;
		name: string;
	};
	created_by?: User;
	time_settings?: User["time_settings"];
	data: PatflowUser["data"];
};

export type WorkerSelect = {
	value: string;
	id: string;
	label: string;
	portrait: ApplicationTypes.Image;
};
