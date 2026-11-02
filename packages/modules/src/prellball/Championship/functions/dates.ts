export const toDateInput = (value?: string) => {
	if (!value) return "";
	if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString().slice(0, 10);
};

export const toDateTimeLocal = (value?: string) => {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const pad = (part: number) => String(part).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const fromDateTimeLocal = (value: string) => {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toISOString();
};

export const formatDateTime = (value?: string) => {
	if (!value) return { date: "—", time: "—" };
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return { date: value, time: "—" };
	return {
		date: date.toLocaleDateString("de-DE"),
		time: date.toLocaleTimeString("de-DE", {
			hour: "2-digit",
			minute: "2-digit"
		})
	};
};
