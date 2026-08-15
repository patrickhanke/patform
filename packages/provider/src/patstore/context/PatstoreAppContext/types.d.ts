import { Module, PatstoreUser, Project } from "@repo/types";
import { languages_short } from "@repo/provider";

export type Language = (typeof languages_short)[number]["value"];

export type ContextValues = {
	pageTitle: sting;
	setPageTitle: Dispatch<SetStateAction<() => void>>;
	project: Project;
	currentModule: Module;
	modules: Module[];
	user: PatstoreUser;
	userLoading: boolean;
	userRole: PatstoreRoleClass;
	language: Language;
	setLanguage: Dispatch<SetStateAction<Language>>;
};
