import { Filter } from "@repo/types";

export const SURCHARGE_REFERENCE_ID = "surcharge";

export const surchargeItemFields = [
	"objectId",
	"title",
	"label",
	"date",
	"description",
	"reference_id",
	"data",
	"former_id",
	"createdAt",
	"updatedAt"
];

export const surchargeItemFilters: Filter[] = [
	{
		key: "reference_id",
		operator: "equalTo",
		value: SURCHARGE_REFERENCE_ID
	}
];
