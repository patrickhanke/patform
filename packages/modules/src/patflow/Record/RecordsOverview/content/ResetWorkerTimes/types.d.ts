import { SelectElement } from "@repo/ui";
import { Dispatch, SetStateAction } from "react";

export type ResetWorkerTimesProps = {
	resetWorkerTimes: boolean;
	setResetWorkerTimes: Dispatch<SetStateAction<boolean>>;
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

