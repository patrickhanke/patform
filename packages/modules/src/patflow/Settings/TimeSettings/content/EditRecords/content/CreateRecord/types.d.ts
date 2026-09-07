import { Record, RecordWeekdaySetting, StaffMember } from "@repo/types";
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

export type CreateRecordTimeSettingsProps = {
	nextRecord: Partial<Record>;
	setNextRecord: Dispatch<SetStateAction<Partial<Record>>>;
};

export type CreateRecordWeekdayProps = {
	setting: RecordWeekdaySetting;
	label: string;
	isOpen: boolean;
	onClose: () => void;
	onChange: (setting: RecordWeekdaySetting) => void;
};

export type CreateRecordSurchargesAndHolidaysProps = {
	surcharges: string[];
	surchargeElements: { label: string; value: string }[];
	setSurcharges: Dispatch<SetStateAction<string[]>>;
	setNextRecord: Dispatch<SetStateAction<Partial<Record>>>;
	isEditing?: boolean;
};
