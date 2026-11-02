export const selectString = (
	option: { value?: unknown } | null | undefined
): string => {
	if (option?.value == null) return "";
	return String(option.value);
};

export const selectStrings = (
	options: { value?: unknown }[] | null | undefined
): string[] => {
	if (!Array.isArray(options)) return [];
	return options.map((option) => selectString(option)).filter(Boolean);
};
