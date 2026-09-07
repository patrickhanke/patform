import { EmailList, Filter } from "@repo/types";

export const buildUserFiltersFromList = (
	list: EmailList,
	baseFilters: Filter[]
): Filter[] | null => {
	if (list.settings?.static_list) {
		const recipientIds = list.settings.recipients ?? [];

		if (recipientIds.length === 0) {
			return null;
		}

		return [
			...baseFilters,
			{
				key: "objectId",
				value: recipientIds,
				operator: "in"
			}
		];
	}

	if (list.settings?.include_all_users) {
		return baseFilters;
	}

	return [...baseFilters, ...(list.settings?.filters ?? [])];
};

export default buildUserFiltersFromList;
