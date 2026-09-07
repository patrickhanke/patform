export const resolveRecipientListId = (value: unknown): string | undefined => {
	if (typeof value === "string" && value.length > 0) {
		return value;
	}

	if (value && typeof value === "object" && "recipient_list" in value) {
		return resolveRecipientListId(
			(value as { recipient_list?: unknown }).recipient_list
		);
	}

	return undefined;
};

export default resolveRecipientListId;
