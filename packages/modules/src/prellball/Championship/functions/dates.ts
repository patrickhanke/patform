/** Display value for a stored date, as dd.mm.yyyy. */
export const formatDeadline = (value?: string) => {
	if (!value) return "—";
	const german = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
	if (german?.[1] && german[2] && german[3]) {
		return `${german[1].padStart(2, "0")}.${german[2].padStart(2, "0")}.${german[3]}`;
	}
	const iso = toDateInput(value);
	if (!iso) return "—";
	const [year, month, day] = iso.split("-");
	if (!year || !month || !day) return "—";
	return `${day}.${month}.${year}`;
};

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
