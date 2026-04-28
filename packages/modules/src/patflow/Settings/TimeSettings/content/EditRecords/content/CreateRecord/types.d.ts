import { Day, Record, StaffMember } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type CreateRecordProps = {
	createRecord: boolean;
	setCreateRecord: Dispatch<SetStateAction<boolean>>;
	userId: string;
	timeSettings: StaffMember["time_settings"];
	refetch: () => void;
	projectId: string;
	person: { label: string; portrait: string };
};

export type RecordSettingsProps = {
	record: Record;
	days: Day[];
};
