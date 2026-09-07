import { BookingType, LedgerBooking, SavingRule } from "@repo/types";

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function memberBalances(
	buchungen: LedgerBooking[]
): Map<string, number> {
	const map = new Map<string, number>();
	for (const booking of buchungen) {
		if (!booking.personId) continue;
		map.set(
			booking.personId,
			(map.get(booking.personId) ?? 0) + (booking.sparer ?? 0)
		);
	}
	return map;
}

export function memberBalance(
	buchungen: LedgerBooking[],
	personId: string
): number {
	return sum(
		buchungen
			.filter((booking) => booking.personId === personId)
			.map((booking) => booking.sparer ?? 0)
	);
}

export type LeerungParts = {
	sparclub: number;
	lotto: number;
	strafgeld: number;
	sparer: number;
};

export function applySavingRule(
	einwurf: number,
	hasLottozahl: boolean,
	vg: number,
	rule: SavingRule
): LeerungParts {
	const isVG = vg > 0;

	let sparclub = 0;
	if (einwurf >= rule.sparclub_min || (rule.sparclub_vg === 1 && isVG)) {
		sparclub = rule.sparclub;
	}

	let lotto = 0;
	if (
		hasLottozahl &&
		(einwurf >= rule.lotto_min || (rule.lotto_vg === 1 && isVG))
	) {
		lotto = rule.lotto;
	}

	let strafgeld = 0;
	if (!isVG && einwurf < rule.einwurf_min) {
		strafgeld = rule.strafgeld;
	}

	return {
		sparclub,
		lotto,
		strafgeld,
		sparer: einwurf - sparclub - lotto - strafgeld
	};
}

const byTyp = (buchungen: LedgerBooking[], typ: BookingType) =>
	buchungen.filter((booking) => booking.type === typ);

export const sumGuthaben = (bookings: LedgerBooking[]) =>
	sum(bookings.map((item) => item.sparer ?? 0));
export const sumEinwurf = (bookings: LedgerBooking[]) =>
	sum(byTyp(bookings, "L").map((item) => item.einwurf ?? 0));
export const sumSparclubbeitrag = (bookings: LedgerBooking[]) =>
	sum(byTyp(bookings, "L").map((item) => item.sparclub ?? 0));
export const sumLottobeitrag = (bookings: LedgerBooking[]) =>
	sum(byTyp(bookings, "L").map((item) => item.lotto ?? 0));
export const sumStrafgeld = (bookings: LedgerBooking[]) =>
	sum(byTyp(bookings, "L").map((item) => item.strafgeld ?? 0));
export const sumAuszahlungMitglieder = (bookings: LedgerBooking[]) =>
	sum(byTyp(bookings, "A").map((item) => item.hauptbuch ?? 0));
export const sumAuszahlungLottogewinne = (bookings: LedgerBooking[]) =>
	sum(byTyp(bookings, "T").map((item) => item.lotto ?? 0));
export const sumSonderbuchungenEinnahmen = (bookings: LedgerBooking[]) =>
	-sum(
		byTyp(bookings, "S")
			.filter((item) => (item.sparer ?? 0) < 0)
			.map((item) => item.sparer ?? 0)
	);
export const sumSonderbuchungenAusgaben = (bookings: LedgerBooking[]) =>
	-sum(
		byTyp(bookings, "S")
			.filter((item) => (item.sparer ?? 0) > 0)
			.map((item) => item.sparer ?? 0)
	);
export const sumGemeinschaftskasseEinnahmen = (bookings: LedgerBooking[]) =>
	sum(
		byTyp(bookings, "G")
			.filter((item) => (item.hauptbuch ?? 0) > 0)
			.map((item) => item.hauptbuch ?? 0)
	);
export const sumGemeinschaftskasseAusgaben = (bookings: LedgerBooking[]) =>
	sum(
		byTyp(bookings, "G")
			.filter((item) => (item.hauptbuch ?? 0) < 0)
			.map((item) => item.hauptbuch ?? 0)
	);

export type CashReport = {
	einwurf: number;
	sparclub: number;
	lotto: number;
	strafgeld: number;
	auszahlungMitglieder: number;
	auszahlungLottogewinne: number;
	sonderEinnahmen: number;
	sonderAusgaben: number;
	externEinnahmen: number;
	externAusgaben: number;
	gesamtEinnahmen: number;
	gesamtAusgaben: number;
	kontostand: number;
	guthabenMitglieder: number;
	verfuegbar: number;
};

export function buildCashReport(buchungen: LedgerBooking[]): CashReport {
	const einwurf = sumEinwurf(buchungen);
	const externEinnahmen = sumGemeinschaftskasseEinnahmen(buchungen);
	const auszahlungMitglieder = sumAuszahlungMitglieder(buchungen);
	const externAusgaben = sumGemeinschaftskasseAusgaben(buchungen);
	const gesamtEinnahmen = einwurf + externEinnahmen;
	const gesamtAusgaben = auszahlungMitglieder + externAusgaben;
	const kontostand = gesamtEinnahmen + gesamtAusgaben;
	const guthabenMitglieder = sumGuthaben(buchungen);

	return {
		einwurf,
		sparclub: sumSparclubbeitrag(buchungen),
		lotto: sumLottobeitrag(buchungen),
		strafgeld: sumStrafgeld(buchungen),
		auszahlungMitglieder,
		auszahlungLottogewinne: sumAuszahlungLottogewinne(buchungen),
		sonderEinnahmen: sumSonderbuchungenEinnahmen(buchungen),
		sonderAusgaben: sumSonderbuchungenAusgaben(buchungen),
		externEinnahmen,
		externAusgaben,
		gesamtEinnahmen,
		gesamtAusgaben,
		kontostand,
		guthabenMitglieder,
		verfuegbar: kontostand - guthabenMitglieder
	};
}

export type EmptyingSummary = {
	wert: number;
	einwurf: number;
	sparclub: number;
	lotto: number;
	strafgeld: number;
	sparer: number;
};

export function emptyingSummaries(
	buchungen: LedgerBooking[]
): EmptyingSummary[] {
	const map = new Map<number, EmptyingSummary>();
	for (const booking of byTyp(buchungen, "L")) {
		const current = map.get(booking.wert) ?? {
			wert: booking.wert,
			einwurf: 0,
			sparclub: 0,
			lotto: 0,
			strafgeld: 0,
			sparer: 0
		};
		current.einwurf += booking.einwurf ?? 0;
		current.sparclub += booking.sparclub ?? 0;
		current.lotto += booking.lotto ?? 0;
		current.strafgeld += booking.strafgeld ?? 0;
		current.sparer += booking.sparer ?? 0;
		map.set(booking.wert, current);
	}
	return Array.from(map.values()).sort((a, b) => b.wert - a.wert);
}

export function emptyingDates(buchungen: LedgerBooking[]): number[] {
	return Array.from(
		new Set(byTyp(buchungen, "L").map((item) => item.wert))
	).sort((a, b) => b - a);
}

export function lastEmptying(buchungen: LedgerBooking[]): number {
	const dates = emptyingDates(buchungen);
	return dates[0] ?? 0;
}

export function pocketSort(a: string, b: string): number {
	const na = parseInt(a, 10);
	const nb = parseInt(b, 10);
	if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
	return (a ?? "").localeCompare(b ?? "", "de");
}

export function rankByMember(
	buchungen: LedgerBooking[],
	value: (booking: LedgerBooking) => number
): Map<string, number> {
	const map = new Map<string, number>();
	for (const booking of buchungen) {
		if (!booking.personId) continue;
		map.set(
			booking.personId,
			(map.get(booking.personId) ?? 0) + value(booking)
		);
	}
	return map;
}
