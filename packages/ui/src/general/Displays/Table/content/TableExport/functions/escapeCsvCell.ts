/** RFC 4180-style CSV cell escaping */
export const escapeCsvCell = (value: string): string => {
	if (
		value.includes('"') ||
		value.includes(",") ||
		value.includes("\n") ||
		value.includes("\r")
	) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
};
