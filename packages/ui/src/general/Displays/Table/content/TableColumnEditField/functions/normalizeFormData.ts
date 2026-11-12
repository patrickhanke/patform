import { Field } from "@repo/types";

/** Stored format for datetime data fields, e.g. 1974-11-29T00:00:00 */
export const formatDateTimeFieldValue = (raw: string): string => {
	const cleaned = raw.replace(/\.\d{3}Z?$/i, "").trim();
	if (!cleaned.includes("T")) return cleaned;
	const [datePart, timePart = "00:00:00"] = cleaned.split("T");
	if (!datePart) return cleaned;
	const segments = timePart.split(":");
	const hours = segments[0] ?? "00";
	const minutes = segments[1] ?? "00";
	const seconds = segments[2]?.slice(0, 2) ?? "00";
	return `${datePart}T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
};

const dateOnlyFieldTypes = new Set<Field["type"]>(["date"]);
const dateTimeFieldTypes = new Set<Field["type"]>(["datetime"]);

export const normalizeFormDataForFields = <T extends Record<string, unknown>>(
	values: T | null | undefined,
	fields: Field[]
): T | null => {
	if (!values) return null;
	const next = { ...values };
	fields.forEach((field) => {
		const raw = next[field.name];
		if (typeof raw !== "string" || !raw) return;
		if (dateOnlyFieldTypes.has(field.type) && raw.includes("T")) {
			next[field.name] = raw.split("T")[0] as T[string];
			return;
		}
		if (dateTimeFieldTypes.has(field.type)) {
			next[field.name] = formatDateTimeFieldValue(raw) as T[string];
		}
	});
	return next;
};

export const formatFormDataForFields = <T extends Record<string, unknown>>(
	values: T,
	fields: Field[]
): T => {
	const next = { ...values };
	fields.forEach((field) => {
		if (field.type !== "datetime") return;
		const raw = next[field.name];
		if (typeof raw === "string" && raw.includes("T")) {
			next[field.name] = formatDateTimeFieldValue(raw) as T[string];
		}
	});
	return next;
};
