import { Filter, ArticleClass, ApolloRefetch, Module } from "@repo/types";
import { PageCreateClassObject } from "@repo/ui";

type FilterArray = Filter[];

export type UseFindArticlesHook = (T: {
	module: Module;
	filters: FilterArray;
	limit?: number;
	skip?: number;
}) => {
	loading: boolean;
	articles: ArticleClass[];
	refetch: ApolloRefetch;
	count: number;
};

export type CreateArticle = (
	persons: { value: string; label: string }[]
) => PageCreateClassObject;

export type DeleteModalProps = {
	isOpen: boolean;
	confirmButtonHandler: () => void;
	header: "Bericht löschen";
};
