import { Module, PageState } from "@repo/types";
import { Field } from "../../Displays";
import { ReactNode } from "react";

export type CreateClassProps = {
	initialData?: {
		[key: keyof T]: string | number | boolean | Array<> | object;
	};
	fields: Array<Field>;
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
	refetch?: () => void;
	createClass?: PageCreateClassObject;
	emptyContent?: boolean;
};

export type CreateClassData = (T: {
	className: string;
	text: string;
	fields: Module["fields"];
	initialData?: {
		[key: keyof T]: string | number | boolean | Array<> | object;
	};
}) => CreateClassProps;
