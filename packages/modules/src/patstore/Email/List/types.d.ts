import { ListFilterItem } from "./content/ListFilter/types";

export type ListSettingsData = {
	static_list?: boolean;
	include_all_users?: boolean;
	filters?: ListFilterItem[];
	unsubscribe?: boolean;
	unsubscribe_link?: string;
};

export type EmailList = {
	objectId: string;
	title: string;
	data?: unknown;
	settings?: ListSettingsData;
	filters?: ListFilterItem[];
};

export type ListChangeHandler = (
	update: Partial<EmailList> | ((prev: EmailList) => EmailList)
) => void;
