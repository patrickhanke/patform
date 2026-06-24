export const formatDate = (dateStr: string): string => {
	const parts = dateStr.split("-");
	return `${parseInt(parts[2] ?? "1")}.${parseInt(parts[1] ?? "1")}.${parts[0] ?? ""}`;
};

export const oneDayBefore = (dateStr: string): string => {
	const d = new Date(dateStr + "T12:00:00");
	d.setDate(d.getDate() - 1);
	return d.toISOString().split("T")[0] ?? dateStr;
};
