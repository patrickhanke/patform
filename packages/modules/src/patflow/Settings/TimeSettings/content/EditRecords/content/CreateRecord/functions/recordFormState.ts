import { Record, RecordTimeSettings } from "@repo/types";
import { RecordBreak } from "../types";

export const parseRecordBreaks = (record: Record): RecordBreak[] => {
	const settings = record.time_settings as RecordTimeSettings & {
		pause?: RecordBreak[];
	};

	if (Array.isArray(settings?.breaks)) {
		return settings.breaks;
	}

	// Legacy records may still store breaks under `pause`
	if (Array.isArray(settings?.pause)) {
		return settings.pause;
	}

	return [];
};

export const applyRecordToFormState = (record: Record) => ({
	year: record.year,
	startDate: record.start_date,
	nextRecord: { ...record } as Partial<Record>,
	surcharges: record.surcharges ?? [],
	breaks: parseRecordBreaks(record)
});

export const isRecordEditable = (
	record: Record,
	currentYear: number
): boolean => record.year >= currentYear && record.year <= currentYear + 1;

export const TIME_SETTINGS_STEP_INDEX = 3;

export const getNextStepIndex = (
	currentStep: number,
	isEditing: boolean
): number => {
	if (isEditing && currentStep === 0) {
		return 3;
	}
	return currentStep + 1;
};

export const getPreviousStepIndex = (
	currentStep: number,
	isEditing: boolean
): number => {
	if (isEditing && currentStep === 3) {
		return 0;
	}
	return currentStep - 1;
};

export const buildEditableTimeSettings = (
	existing: RecordTimeSettings,
	updated: RecordTimeSettings,
	isEditing: boolean
): RecordTimeSettings => {
	if (!isEditing) {
		return updated;
	}
	return {
		...updated,
		hours: existing.hours,
		weekdays: existing.weekdays
	};
};
