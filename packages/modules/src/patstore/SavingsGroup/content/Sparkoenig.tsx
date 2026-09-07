"use client";

import { useMemo } from "react";
import { ColumnDef, InfoBox, Page, Table } from "@repo/ui";
import { LedgerBooking } from "@repo/types";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import { rankByMember } from "../functions/calc";
import { memberDisplayName } from "../functions/format";
import { SavingsGroupScreen } from "../constants/screens";
import MoneyCell from "../components/MoneyCell";

const CONFIG: Record<
	string,
	{
		title: string;
		subtitle: string;
		value: (booking: LedgerBooking) => number;
	}
> = {
	"sparkoenig-auszahlung": {
		title: "Sparkönig – Auszahlung",
		subtitle: "Mitglieder nach Höhe der erhaltenen Auszahlungen.",
		value: (booking) =>
			booking.type === "A" ? -(booking.hauptbuch ?? 0) : 0
	},
	"sparkoenig-einwurf": {
		title: "Sparkönig – Einwurf",
		subtitle:
			"Mitglieder nach Höhe des gesamten Einwurfs in den Sparkasten.",
		value: (booking) => (booking.type === "L" ? (booking.einwurf ?? 0) : 0)
	},
	"sparkoenig-lottogewinn": {
		title: "Sparkönig – Lottogewinn",
		subtitle: "Mitglieder nach Höhe der gebuchten Lottogewinne.",
		value: (booking) => (booking.type === "T" ? (booking.sparer ?? 0) : 0)
	},
	"sparkoenig-strafgeld": {
		title: "Sparkönig – Strafgeld",
		subtitle: "Mitglieder nach Höhe der gezahlten Strafgelder.",
		value: (booking) =>
			booking.type === "L" ? (booking.strafgeld ?? 0) : 0
	}
};

const DEFAULT_SPARKOENIG = {
	title: "Sparkönig",
	subtitle: "",
	value: () => 0
};

const Sparkoenig = ({ screen }: { screen: SavingsGroupScreen }) => {
	const { bookings, members, currency, refetch } = useSavingsGroup();
	const config = CONFIG[screen] ?? DEFAULT_SPARKOENIG;

	const ranking = useMemo(() => {
		if (!config) return [];
		const totals = rankByMember(bookings, config.value);
		return Array.from(totals.entries())
			.map(([personId, value]) => ({ personId, value }))
			.filter((row) => row.value !== 0)
			.sort((a, b) => b.value - a.value);
	}, [bookings, config]);

	const medal = (index: number) =>
		index === 0
			? "1."
			: index === 1
				? "2."
				: index === 2
					? "3."
					: `${index + 1}.`;

	const columns: ColumnDef<(typeof ranking)[number]>[] = [
		{
			id: "rank",
			header: () => <span>Platz</span>,
			accessorFn: (_row, index) => medal(index),
			cell: (info) => info.getValue()
		},
		{
			id: "fach",
			header: () => <span>Fach</span>,
			accessorFn: (row) =>
				members.find((member) => member.personId === row.personId)
					?.sparfach || "–",
			cell: (info) => <strong>{String(info.getValue())}</strong>
		},
		{
			id: "name",
			header: () => <span>Mitglied</span>,
			accessorFn: (row) => {
				const member = members.find(
					(item) => item.personId === row.personId
				);
				return member ? memberDisplayName(member, true) : "—";
			},
			cell: (info) => info.getValue()
		},
		{
			id: "betrag",
			header: () => <span>Betrag</span>,
			accessorFn: (row) => row.value,
			cell: (info) => (
				<MoneyCell
					cents={info.getValue() as number}
					currency={currency}
					bold
					colored={false}
				/>
			)
		}
	];

	return (
		<Page
			title={config?.title || "Sparkönig"}
			description={config?.subtitle}
			emptyContent
			refetch={refetch}
		>
			{ranking.length === 0 ? (
				<InfoBox
					status="info"
					text="Noch keine Daten für diese Statistik vorhanden."
				/>
			) : (
				<Table
					columns={columns}
					data={ranking}
					rowCount={ranking.length}
				/>
			)}
		</Page>
	);
};

export default Sparkoenig;
