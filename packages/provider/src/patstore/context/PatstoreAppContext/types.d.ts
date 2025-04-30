import { Module, PatstoreUser, Project } from "@repo/types";

export type ContextValues = {
	pageTitle: sting;
	setPageTitle: Dispatch<SetStateAction<() => void>>;
	project: Project;
	currentModule: Module;
	modules: Module[];
	user: PatstoreUser;
};
