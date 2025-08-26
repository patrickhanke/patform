import { EventDate } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type TableColumnEditDateProps = {
	value: EventDate | undefined;
	onChange: (value: EventDate) => Promise<void>;
};

export type DateEditProps = {
	date: EventDate;
	setDate: Dispatch<SetStateAction<EventDate>>;
};
