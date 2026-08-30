export const weekdays = [
	{ value: "Montag", label: "Montag" },
	{ value: "Dienstag", label: "Dienstag" },
	{ value: "Mittwoch", label: "Mittwoch" },
	{ value: "Donnerstag", label: "Donnerstag" },
	{ value: "Freitag", label: "Freitag" },
	{ value: "Samstag", label: "Samstag" },
	{ value: "Sonntag", label: "Sonntag" }
];

export const dayTimes = Array.from({ length: 14 }, (_, hourOffset) => {
	const hours = hourOffset + 10;
	return [0, 15, 30, 45].map((minutes) => {
		const label = `${hours}:${String(minutes).padStart(2, "0")}`;
		return {
			value: label,
			label,
			time: { hours, minutes }
		};
	});
}).flat();
