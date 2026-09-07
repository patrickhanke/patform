export function formatCents(
	cents: number | null | undefined,
	currency = "EUR"
): string {
	const value = (cents ?? 0) / 100;
	try {
		return new Intl.NumberFormat("de-DE", {
			style: "currency",
			currency
		}).format(value);
	} catch {
		return `${value.toLocaleString("de-DE", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})} ${currency}`;
	}
}

export function parseEuroToCents(input: string): number {
	if (!input) return 0;
	let source = input.trim().replace(/[^\d.,-]/g, "");
	if (source === "" || source === "-") return 0;
	const hasComma = source.includes(",");
	const hasDot = source.includes(".");
	if (hasComma && hasDot) {
		source = source.replace(/\./g, "").replace(",", ".");
	} else if (hasComma) {
		source = source.replace(",", ".");
	}
	const value = parseFloat(source);
	if (Number.isNaN(value)) return 0;
	return Math.round(value * 100);
}

export function centsToInput(cents: number | null | undefined): string {
	const value = (cents ?? 0) / 100;
	return value.toLocaleString("de-DE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		useGrouping: false
	});
}

const MONTHS_DE = [
	"Januar",
	"Februar",
	"März",
	"April",
	"Mai",
	"Juni",
	"Juli",
	"August",
	"September",
	"Oktober",
	"November",
	"Dezember"
];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function unixToDateDe(unix: number | null | undefined): string {
	if (!unix) return "";
	const date = new Date(unix * 1000);
	return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function unixToDateDeFull(unix: number | null | undefined): string {
	if (!unix) return "";
	const date = new Date(unix * 1000);
	const month = MONTHS_DE[date.getMonth()] ?? "";
	return `${date.getDate()}. ${month} ${date.getFullYear()}`;
}

export function nowUnix(): number {
	return Math.floor(Date.now() / 1000);
}

export function dateInputToUnix(value: string): number {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
	if (!match) return 0;
	const date = new Date(
		Number(match[1]),
		Number(match[2]) - 1,
		Number(match[3]),
		12,
		0,
		0
	);
	if (Number.isNaN(date.getTime())) return 0;
	return Math.floor(date.getTime() / 1000);
}

export function unixToDateInput(unix: number | null | undefined): string {
	if (!unix) return "";
	const date = new Date(unix * 1000);
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function anredeLabel(anrede?: string): string {
	switch (anrede) {
		case "1":
			return "Frau";
		case "2":
			return "Herr";
		default:
			return "";
	}
}

export function memberDisplayName(
	member: {
		firstName?: string;
		lastName?: string;
		lottozahl?: string;
		personName?: string;
	},
	withLotto = false
): string {
	const composed =
		`${(member.firstName ?? "").trim()} ${(member.lastName ?? "").trim()}`.trim();
	const name = composed || (member.personName ?? "").trim();
	const lotto = (member.lottozahl ?? "").trim();
	if (withLotto && lotto.length > 0) {
		return `${name} (${lotto})`;
	}
	return name;
}
