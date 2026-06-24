import { Record, StaffMember } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type CreateRecordProps = {
	createRecord: boolean;
	setCreateRecord: Dispatch<SetStateAction<boolean>>;
	mode: "create" | "edit";
	userId: string;
	timeSettings: StaffMember["time_settings"];
	refetch: () => void;
	projectId: string;
	person: { label: string; portrait: string };
};

export type CreateRecordEmployeeProps = {
	person: CreateRecordProps["person"];
	mode: CreateRecordProps["mode"];
	records: Record[];
	nextYearStartDate: string;
	nextYearRecord: Record | null;
	onEditRecord: (record: Record) => void;
};

export type CreateRecordStartDateProps = {
	currentYear: number;
	startDate: string;
	existingStartDates: Set<string>;
	conflictingRecord: Record | null;
	onSelect: (date: string) => void;
	isEditing?: boolean;
	nextYearStartDate: string;
	nextYearRecord: Record | null;
	onEditRecord: (record: Record) => void;
};

export type CreateRecordImportSourceProps = {
	importMode: "new" | "import";
	latestRecord: Record | null;
	onSelect: (mode: "new" | "import") => void;
	isEditing?: boolean;
};

export type RecordBreak = {
	start: string;
	end: string;
	id: string;
};

export type CreateRecordTimeSettingsProps = {
	nextRecord: Partial<Record>;
	setNextRecord: Dispatch<SetStateAction<Partial<Record>>>;
	breaks: RecordBreak[];
	setBreaks: Dispatch<SetStateAction<RecordBreak[]>>;
	isEditing?: boolean;
};

export type CreateRecordSurchargesAndHolidaysProps = {
	surcharges: string[];
	surchargeElements: { label: string; value: string }[];
	setSurcharges: Dispatch<SetStateAction<string[]>>;
	setNextRecord: Dispatch<SetStateAction<Partial<Record>>>;
	isEditing?: boolean;
};
