import { Field } from "@repo/ui";

export type AdditionalField = {
	value: string;
	label: string;
	search_path: string;
	type: Field["type"];
};