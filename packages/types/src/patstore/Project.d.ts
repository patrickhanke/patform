import { Module } from "./Module";

type LanguageLabel = "Englisch" | "Deutsch";
export type LanguageValue = "en" | "de";
type LanguageLabelShort = "EN" | "DE";

export type Language = {
	value: LanguageValue;
	label: LanguageLabel | LanguageLabelShort;
};

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
	lettermint: {
		key: string;
		project_id: string;
	};
	settings: {
		email: string;
		user_invitations: boolean;
		user_creation: boolean;
		languages: LanguageValue[];
		default_language: LanguageValue;
	};
	connected_images: {
		[key: string]: {
			images: string[];
			module_id: string;
			object_id: string;
			class_name: string;
		};
	};
};
