export type PatstoreProjectInvitation = {
	email: string;
	name: string;
	key: string;
	date: {
		iso: string;
		__type: "Date";
	};
};

export type PatstoreProject = {
	name: string;
	description: string;
	objectId: string;
	content: { label: string; value: string; icon: string }[];
	logo: {
		url: string;
		name: string;
	};
	path: string;
	modules: Module[];
	invitations: PatstoreProjectInvitation[];
	settings: {
		email: string;
		lettermint_key: string;
		lettermint_project_id: string;
		user_invitations: boolean;
		user_creation: boolean;
	};
};
