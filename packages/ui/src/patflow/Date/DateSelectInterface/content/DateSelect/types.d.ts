import { DateTypes, Task } from "@repo/types";
import date_category_options from "./constants/date_category_options";
import { Dispatch, SetStateAction } from "react";

export type DateSelectProps = {
	date: Task["times"] | undefined;
	setDate: Dispatch<SetStateAction<DateTypes.DateObjectWithNextDates>>;
	isService?: boolean;
};

export type DateSelectExternalStateProps = {
	date: DateTypes.DateObjectWithNextDates | undefined;
	dataHandler: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type DateCategoriesProps = {
	value: (typeof date_category_options)[number];
	onChange: (value: (typeof date_category_options)[number]) => void;
};

export type SingleDateSelectInterfaceProps = {
	date: DateTypes.DateObjectWithNextDates;
	category: (typeof date_category_options)[number]["value"];
	onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type MultiDateSelectInterfaceProps = {
	date: DateTypes.DateObjectWithNextDates;
	category: (typeof date_category_options)[number]["value"];
	onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type IntervalDateSelectInterfaceProps = {
	date: DateTypes.DateObjectWithNextDates;
	category: (typeof date_category_options)[number]["value"];
	onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type IntervalInfoProps = {
	dates: string[];
};
