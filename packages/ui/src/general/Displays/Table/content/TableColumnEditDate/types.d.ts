import { EventDate } from "@repo/types";
import { Updater } from "use-immer";

export type TableColumnEditDateProps = {
	value: EventDate | undefined;
	onChange: (value: EventDate) => void;
};

export type DateEditProps = {
	date: EventDate;
	setDate: Updater<EventDate>;
};
