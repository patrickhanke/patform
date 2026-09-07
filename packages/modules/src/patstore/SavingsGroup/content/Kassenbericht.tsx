"use client";

import { useMemo } from "react";
import { Page } from "@repo/ui";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import { buildCashReport } from "../functions/calc";
import { formatCents } from "../functions/format";
import MoneyCell from "../components/MoneyCell";

const Kassenbericht = () => {
	const { bookings, members, currency, refetch } = useSavingsGroup();
	const report = useMemo(() => buildCashReport(bookings), [bookings]);
	const memberCount = members.length;
	const activeCount = members.filter((member) => member.status >= 1).length;

	const perMember = (count: number) => {
		if (count <= 0) return null;
		return {
			each: Math.trunc(report.verfuegbar / count),
			rest: report.verfuegbar % count
		};
	};
	const perAll = perMember(memberCount);
	const perActive = perMember(activeCount);

	return (
		<Page title="Kassenbericht" emptyContent refetch={refetch}>
			<div className="flex col a-st gap-sm" style={{ maxWidth: 720 }}>
				<h3>Einnahmen Sparkastenleerungen</h3>
				<ReportRow
					label="Gesamteinwurf in den Sparkasten"
					cents={report.einwurf}
					currency={currency}
				/>
				<ReportRow
					label="Einnahmen bei den Leerungen für den Sparclub"
					cents={report.sparclub}
					currency={currency}
				/>
				<ReportRow
					label="Einnahmen bei den Leerungen für das interne Lottospiel"
					cents={report.lotto}
					currency={currency}
				/>
				<ReportRow
					label="Einnahmen bei den Leerungen durch Strafgelder"
					cents={report.strafgeld}
					currency={currency}
				/>
				<h3>Auszahlungen an Mitglieder</h3>
				<ReportRow
					label="Ausgezahltes Guthaben an Mitglieder"
					cents={report.auszahlungMitglieder}
					currency={currency}
				/>
				<ReportRow
					label="Gebuchte Lottogewinne an Mitglieder"
					cents={report.auszahlungLottogewinne}
					currency={currency}
				/>
				<h3>Sonderbuchungen</h3>
				<ReportRow
					label="Einnahmen durch Sonderbuchungen von Mitgliedern"
					cents={report.sonderEinnahmen}
					currency={currency}
				/>
				<ReportRow
					label="Ausgaben durch Sonderbuchungen an Mitgliedern"
					cents={report.sonderAusgaben}
					currency={currency}
				/>
				<h3>Externe Einnahmen und Ausgaben</h3>
				<ReportRow
					label="Externe Einnahmen in die Gemeinschaftskasse"
					cents={report.externEinnahmen}
					currency={currency}
				/>
				<ReportRow
					label="Externe Ausgaben aus der Gemeinschaftskasse"
					cents={report.externAusgaben}
					currency={currency}
				/>
				<h3>Vereinsvermögen</h3>
				<ReportRow
					label="Gesamteinnahmen"
					cents={report.gesamtEinnahmen}
					currency={currency}
				/>
				<ReportRow
					label="Gesamtausgaben"
					cents={report.gesamtAusgaben}
					currency={currency}
				/>
				<ReportRow
					label="…entspricht einem Kontostand von"
					cents={report.kontostand}
					currency={currency}
					strong
				/>
				<ReportRow
					label="…davon aktuelles Guthaben der Mitglieder"
					cents={report.guthabenMitglieder}
					currency={currency}
				/>
				<ReportRow
					label="Verfügbares Sparclubvermögen (ohne Mitgliederguthaben)"
					cents={report.verfuegbar}
					currency={currency}
					strong
				/>
				{perAll ? (
					<ReportRow
						label={`…je Mitglied bei allen ${memberCount} ${memberCount === 1 ? "Mitglied" : "Mitgliedern"}${perAll.rest ? ` (Rest: ${formatCents(perAll.rest, currency)})` : ""}`}
						cents={perAll.each}
						currency={currency}
					/>
				) : null}
				{perActive ? (
					<ReportRow
						label={`…je Mitglied bei ${activeCount} aktiven ${activeCount === 1 ? "Mitglied" : "Mitgliedern"}${perActive.rest ? ` (Rest: ${formatCents(perActive.rest, currency)})` : ""}`}
						cents={perActive.each}
						currency={currency}
					/>
				) : null}
			</div>
		</Page>
	);
};

const ReportRow = ({
	label,
	cents,
	currency,
	strong
}: {
	label: string;
	cents: number;
	currency: string;
	strong?: boolean;
}) => (
	<div
		className="flex row a-c j-sb gap-md"
		style={{
			padding: "8px 0",
			borderBottom: "1px solid var(--chakra-colors-border, #e2e8f0)",
			fontWeight: strong ? 700 : 400
		}}
	>
		<span>{label}</span>
		<MoneyCell cents={cents} currency={currency} bold={strong} />
	</div>
);

export default Kassenbericht;
