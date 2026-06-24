import { ApolloRefetch, Surcharge } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type SurchargeComponentProps = {
	surcharge: Surcharge;
	updateSurchargeHandler: (surcharge: Surcharge) => Promise<void>;
	setEditSurcharge: Dispatch<SetStateAction<Surcharge | null>>;
	setDeleteSurcharge: Dispatch<SetStateAction<Surcharge | null>>;
};

export type SelectRecordElement = {
	value: string;
	label: string;
	user_id: string;
};

export type RecordSelectProps = {
	initialSelectedRecords: string[];
	refetch: ApolloRefetch;
	surchargeId: string;
};
