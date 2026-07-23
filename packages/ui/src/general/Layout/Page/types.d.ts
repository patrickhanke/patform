import { ApolloRefetch, ModuleField, PageState } from "@repo/types";
import { ReactNode } from "react";

export type CreateClassProps = {
	initialData?: {
		[key: keyof T]: string | number | boolean | Array<> | object;
	};
	fields: ModuleField[];
	text: string;
	className: string;
	refetch?: () => void;
};

export type PageHeaderButton = {
	text: string;
	onClick: () => void;
	is_add_button?: boolean;
	is_reset_button?: boolean;
	color?: string;
	disabled?: boolean;
};

export type PageHeaderButtons = PageHeaderButton[];

type PageHeaderContent = ReactNode | null;

export type PageCreateClassObject<T> = CreateClassProps<T>;

export type PageProps = {
	title?: string;
	description?: string;
	children: React.ReactNode;
	pageHeaderButtons?: PageHeaderButtons;
	pageHeaderContent?: PageHeaderContent;
	pageStates?: PageState[];
	pageState?: PageState;
	setPageState?: Dispatch<SetStateAction<PageState>>;
	refetch?: ApolloRefetch;
	createClass?: PageCreateClassObject;
	emptyContent?: boolean;
};

type PageSkeletonProps = {
	title?: string;
	pageHeaderButtons?: number;
	description?: boolean;
	pageHeaderContent?: React.ReactNode;
	createClass?: boolean;
	pageStates?: number;
};
