export const selectString = (
	option: { value?: unknown } | null | undefined
): string => {
	if (option?.value == null) {
		return "";
	}
	return String(option.value);
};
