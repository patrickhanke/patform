import { ApolloRefetch, ContentClass, Filter } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type UseFindContentHook = (T: {
	moduleId: string;
	filters: Filter[];
	skip: number;
	limit: number;
}) => {
	loading: boolean;
	content?: ContentClass[];
	refetch: ApolloRefetch;
	count: number;
};

export type CreateContentProps = {
	createContent: boolean;
	setCreateContent: Dispatch<SetStateAction<boolean>>;
	allContent: ContentClass[];
	refetch: ApolloRefetch;
};

export type EmailContentProps = {
	data: object;
	refetch: ApolloRefetch;
};
