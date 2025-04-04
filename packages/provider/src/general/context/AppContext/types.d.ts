import { Module, Project } from "@repo/types";

export type ContextValues = {
	project: PatstoreContext | undefined;
	loadProject: (projectId: string) => void;
};

export type ProjectLoaderProps = {
	loading: boolean;
	error?: any;
	project?: PatstoreContext | undefined;
	appId: string;
};
