export const formatTime = (
	hours: number | null | undefined,
	minutes: number | null | undefined
) => {
	if (hours == null || minutes == null) {
		return "—";
	}
	return `${hours}:${String(minutes).padStart(2, "0")}`;
};

export const timeSelectValue = (
	hours: number | null | undefined,
	minutes: number | null | undefined
) => {
	if (hours == null || minutes == null) {
		return null;
	}
	const label = formatTime(hours, minutes);
	return { value: label, label };
};
