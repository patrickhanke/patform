"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { InfoBox, Loader, Page } from "@repo/ui";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import {
	buildCashReport,
	lastEmptying,
	memberBalances
} from "../functions/calc";
import { formatCents, unixToDateDeFull } from "../functions/format";
import { importSavingsGroupSeed } from "../functions/importSeed";
import { savingsGroupUpdateOptions } from "../functions/updateOptions";

const QUICK = [
	{ href: "/savings-group/sparfachbelegung", label: "Sparfachbelegung" },
	{ href: "/savings-group/leerungen", label: "Sparkastenleerung erfassen" },
	{ href: "/savings-group/auszahlungen", label: "Auszahlung buchen" },
	{ href: "/savings-group/konto", label: "Kontoauszüge ansehen" },
	{ href: "/savings-group/kassenbericht", label: "Kassenbericht" }
];

const Pinnwand = () => {
	const {
		module,
		moduleData,
		members,
		bookings,
		currency,
		loading,
		refetch,
		createData,
		updateData,
		peopleModuleId
	} = useSavingsGroup();
	const [importing, setImporting] = useState(false);
	const [progress, setProgress] = useState("");

	const stats = useMemo(() => {
		const balances = memberBalances(bookings);
		const totalMemberCredit = Array.from(balances.values()).reduce(
			(sum, value) => sum + value,
			0
		);
		const report = buildCashReport(bookings);
		const active = members.filter((member) => member.status >= 1).length;
		return {
			members: members.length,
			active,
			totalMemberCredit,
			kontostand: report.kontostand,
			verfuegbar: report.verfuegbar,
			bookings: bookings.length,
			last: lastEmptying(bookings)
		};
	}, [bookings, members]);

	const clubName = moduleData.settings.name?.trim() || "Ihr Sparclub";

	const importSeed = async () => {
		if (importing) return;
		if (
			moduleData.seedImported ||
			bookings.length > 0 ||
			members.length > 0
		) {
			const confirmed = window.confirm(
				"Es sind bereits Daten vorhanden. Beispieldaten trotzdem importieren?"
			);
			if (!confirmed) return;
		}
		setImporting(true);
		try {
			const next = await importSavingsGroupSeed({
				createData,
				moduleId: module.objectId,
				peopleModuleId,
				onProgress: setProgress
			});
			await updateData({
				className: "Module",
				objectId: module.objectId,
				updateObject:
					savingsGroupUpdateOptions(module).updateObject(next),
				feedback: "Beispieldaten importiert"
			});
			await refetch();
		} finally {
			setImporting(false);
			setProgress("");
		}
	};

	if (loading) {
		return <Loader width="100%" height="100%" />;
	}

	return (
		<Page
			title="Pinnwand"
			description={clubName}
			emptyContent
			refetch={refetch}
			pageHeaderButtons={[
				{
					text: importing
						? progress || "Importiere…"
						: "Beispieldaten importieren",
					onClick: importSeed,
					disabled: importing,
					is_add_button: true
				}
			]}
		>
			<div className="flex col a-st gap-md">
				<InfoBox
					status="info"
					maxWidth="100%"
					text={
						stats.last > 0
							? `Letzte Sparkastenleerung: ${unixToDateDeFull(stats.last)}`
							: "Noch keine Sparkastenleerung erfasst."
					}
				/>
				<div
					className="flex row a-st gap-md"
					style={{ flexWrap: "wrap" }}
				>
					<StatTile
						label="Kontostand"
						value={formatCents(stats.kontostand, currency)}
					/>
					<StatTile
						label="Guthaben der Mitglieder"
						value={formatCents(stats.totalMemberCredit, currency)}
					/>
					<StatTile
						label="Verfügbares Sparclubvermögen"
						value={formatCents(stats.verfuegbar, currency)}
					/>
					<StatTile
						label="Mitglieder"
						value={String(stats.members)}
						hint={`${stats.active} aktiv`}
					/>
					<StatTile
						label="Buchungen"
						value={String(stats.bookings)}
					/>
				</div>
				<div className="flex col a-st gap-sm">
					<h3>Schnellzugriff</h3>
					{QUICK.map((item) => (
						<Link key={item.href} href={item.href}>
							{item.label}
						</Link>
					))}
				</div>
			</div>
		</Page>
	);
};

const StatTile = ({
	label,
	value,
	hint
}: {
	label: string;
	value: string;
	hint?: string;
}) => (
	<div
		className="flex col a-st gap-sm"
		style={{
			minWidth: 200,
			flex: "1 1 200px",
			padding: 16,
			border: "1px solid var(--chakra-colors-border, #e2e8f0)",
			borderRadius: 8
		}}
	>
		<p>{label}</p>
		<strong style={{ fontSize: 20 }}>{value}</strong>
		{hint ? <p>{hint}</p> : null}
	</div>
);

export default Pinnwand;
