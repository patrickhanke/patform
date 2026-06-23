import { PatstoreUser } from "@repo/types";
import getListMembers from "../../List/functions/getListMembers";
import { EmailList } from "../../List/types";
import { EmailRecipient } from "../types";

const resolveUserEmailForList = (
	user: PatstoreUser,
	listId: string
): { email: string; suppressed: boolean } | null => {
	const listEmail = user.emails?.find((entry) =>
		entry.lists.includes(listId)
	);

	if (listEmail) {
		return {
			email: listEmail.email,
			suppressed: listEmail.suppression?.suppressed ?? false
		};
	}

	if (user.email) {
		const matchingEntry = user.emails?.find(
			(entry) => entry.email === user.email
		);

		return {
			email: user.email,
			suppressed: matchingEntry?.suppression?.suppressed ?? false
		};
	}

	const firstEmail = user.emails?.[0];

	if (firstEmail) {
		return {
			email: firstEmail.email,
			suppressed: firstEmail.suppression?.suppressed ?? false
		};
	}

	return null;
};

export const buildEmailRecipientsFromUsers = (
	list: EmailList,
	users: PatstoreUser[]
): {
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
} => {
	const listId = list.objectId;
	const members = getListMembers(list, users, listId);
	const recipients: EmailRecipient[] = [];
	const suppressedRecipients: EmailRecipient[] = [];

	members.forEach((user) => {
		const resolved = resolveUserEmailForList(user, listId);

		if (!resolved) {
			return;
		}

		const recipient: EmailRecipient = {
			data: {
				label: user.label || "",
				title: user.title || user.salutation || "",
				pre_title: user.pre_title || "",
				first_name: user.first_name || "",
				last_name: user.last_name || ""
			},
			suppressed: resolved.suppressed,
			listName: list.title,
			userId: user.objectId,
			email: resolved.email
		};

		if (resolved.suppressed) {
			suppressedRecipients.push(recipient);
		} else {
			recipients.push(recipient);
		}
	});

	return { recipients, suppressedRecipients };
};

export default buildEmailRecipientsFromUsers;
