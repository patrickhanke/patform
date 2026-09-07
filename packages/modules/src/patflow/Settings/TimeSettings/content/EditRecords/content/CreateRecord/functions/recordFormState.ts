import { Record, RecordTimeSettings } from "@repo/types";
import { normalizeTimeSettings } from "@repo/provider";

export const applyRecordToFormState = (record: Record) => ({
	year: record.year,
	startDate: record.start_date,
	nextRecord: {
		...record,
		time_settings: normalizeTimeSettings(record.time_settings)
	} as Partial<Record>,
	surcharges: record.surcharges ?? []
});

export const isRecordEditable = (record: Record): boolean => {
	const today = new Date().toISOString().split("T")[0] ?? "";
	return record.end_date >= today;
};

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

/**
 * The weekly `hours` and the `saldo` of every weekday are derived values, so
 * they are recalculated before the settings are written to the record.
 */
export const buildEditableTimeSettings = (
	updated: RecordTimeSettings
): RecordTimeSettings => normalizeTimeSettings(updated);
