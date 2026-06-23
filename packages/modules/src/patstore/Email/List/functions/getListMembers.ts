import { PatstoreUser } from "@repo/types";
import { matchUsersAgainstFilters } from "../content/ListFilter/functions/buildFilterFieldDefinitions";
import { ListFilterItem } from "../content/ListFilter/types";
import { EmailList } from "../types";

const getListMembers = (
	list: EmailList,
	users: PatstoreUser[],
	listId: string
): PatstoreUser[] => {
	const filters = (list.settings?.filters ||
		list.filters ||
		[]) as ListFilterItem[];
	const isStaticList = list.settings?.static_list !== false;

	if (isStaticList) {
		return users.filter((user) =>
			user?.emails?.some((email) => email.lists.includes(listId))
		);
	}

	if (filters.length === 0) {
		return [];
	}

	return matchUsersAgainstFilters(users, filters);
};

export default getListMembers;
