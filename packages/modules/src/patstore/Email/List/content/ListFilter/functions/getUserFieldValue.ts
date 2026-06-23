import { get } from "lodash-es";
import { PatstoreUser } from "@repo/types";

const TOP_LEVEL_KEYS = new Set([
	"salutation",
	"title",
	"pre_title",
	"post_title",
	"first_name",
	"last_name",
	"label",
	"email",
	"username",
	"name",
	"newsletter_optin",
	"newsletter_email"
]);

export const getUserFieldValue = (
	user: PatstoreUser,
	key: string
): unknown => {
	if (TOP_LEVEL_KEYS.has(key) && key in user) {
		return user[key as keyof PatstoreUser];
	}

	const dataValue = get(user.data, key);
	if (dataValue !== undefined) {
		return dataValue;
	}

	const settingsValue = get(user.settings, key);
	if (settingsValue !== undefined) {
		return settingsValue;
	}

	if (key.startsWith("settings.")) {
		return get(user.settings, key.replace(/^settings\./, ""));
	}

	return undefined;
};

export default getUserFieldValue;
