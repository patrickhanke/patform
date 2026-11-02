export const weekdays = [
	"Montag",
	"Dienstag",
	"Mittwoch",
	"Donnerstag",
	"Freitag",
	"Samstag",
	"Sonntag"
].map((day) => ({ value: day, label: day }));

const firstMinute = 10 * 60;
const lastMinute = 23 * 60 + 45;

export const dayTimes = Array.from(
	{ length: (lastMinute - firstMinute) / 15 + 1 },
	(_, index) => {
		const total = firstMinute + index * 15;
		const hours = Math.floor(total / 60);
		const minutes = total % 60;
		const label = `${hours}:${String(minutes).padStart(2, "0")}`;
		return { value: label, label, hours, minutes };
	}
);
