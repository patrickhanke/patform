import { SelectElement } from "@repo/ui";
import { Dispatch, SetStateAction } from "react";
import table_fields from "./constants/table_fields";

export type PrintWorkerTimesProps = {
	printWorkerTimes: boolean;
	setPrintWorkerTimes: Dispatch<SetStateAction<boolean>>;
};

export type SelectStaffProps = {
	selectedWorker: SelectElement[];
	setSelectedWorker: Dispatch<SetStateAction<SelectElement[]>>;
};

export type ModalButtons = {
	text: string;
	onClick: () => void;
	disabled: [boolean, boolean];
};

export type SelectTimesProps = {
	selectedTimes: { year: number; month: number };
	setSelectedTimes: Dispatch<SetStateAction<{ year: number; month: number }>>;
};

export type YearOptions = { value: number; label: string }[];

export type SelectFieldsProps = {
	setFields: Dispatch<
		SetStateAction<(typeof table_fields)[number]["value"][]>
	>;
	fields: (typeof table_fields)[number]["value"][];
};

export type UseFindDays = (P: { year: number; users: string[] }) => {
	loading: boolean;
	days: Day[];
	refetch: ApolloRefetch;
};

export type UseFindRecord = (P: { year: number; users: string[] }) => {
	loading: boolean;
	records: Record[];
	refetch: ApolloRefetch;
};

export type UseFindSurcharges = (P: { year: number; users: string[] }) => {
	loading: boolean;
	surcharges: Surcharge[];
	refetch: ApolloRefetch;
};
