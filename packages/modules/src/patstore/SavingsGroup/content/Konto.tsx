"use client";

import { useMemo, useState } from "react";
import { ColumnDef, InfoBox, Page, Table } from "@repo/ui";
import { LedgerBooking } from "@repo/types";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import { memberBalance } from "../functions/calc";
import { memberDisplayName, unixToDateDe } from "../functions/format";
import { BOOKING_TYPE_LABELS } from "../constants/defaults";
import MemberSelect from "../components/MemberSelect";
import MoneyCell from "../components/MoneyCell";

const Konto = () => {
	const { members, bookings, currency, refetch } = useSavingsGroup();
	const [personId, setPersonId] = useState<string | null>(null);
	const selected = members.find((member) => member.personId === personId);

	const entries = useMemo(() => {
		if (!personId) return [];
		const list = bookings
			.filter((booking) => booking.personId === personId)
			.sort(
				(a, b) =>
					a.wert - b.wert || a.objectId.localeCompare(b.objectId)
			);
		let running = 0;
		return list.map((booking) => {
			running += booking.sparer ?? 0;
			return { booking, saldo: running };
		});
	}, [bookings, personId]);

	const balance = personId ? memberBalance(bookings, personId) : 0;

	const columns: ColumnDef<{ booking: LedgerBooking; saldo: number }>[] = [
		{
			id: "date",
			header: () => <span>Datum</span>,
			accessorFn: (row) => unixToDateDe(row.booking.wert),
			cell: (info) => info.getValue()
		},
		{
			id: "art",
			header: () => <span>Art</span>,
			accessorFn: (row) =>
				BOOKING_TYPE_LABELS[row.booking.type] || row.booking.type,
			cell: (info) => info.getValue()
		},
		{
			id: "text",
			header: () => <span>Vorgang</span>,
			accessorFn: (row) => row.booking.text || "",
			cell: (info) => info.getValue()
		},
		{
			id: "betrag",
			header: () => <span>Betrag</span>,
			accessorFn: (row) => row.booking.sparer ?? 0,
			cell: (info) => (
				<MoneyCell
					cents={info.getValue() as number}
					currency={currency}
				/>
			)
		},
		{
			id: "saldo",
			header: () => <span>Saldo</span>,
			accessorFn: (row) => row.saldo,
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
		<Page title="Sparer-Kontoauszüge" emptyContent refetch={refetch}>
			<div className="flex col a-st gap-md">
				<MemberSelect
					members={members}
					value={personId}
					onChange={setPersonId}
					label="Sparfach für Kontoauszug"
					placeholder="Sparfach wählen…"
					width={360}
				/>
				{selected ? (
					<InfoBox
						status="info"
						maxWidth="100%"
						text={`${selected.sparfach} – ${memberDisplayName(selected, true)} · Aktuelles Guthaben siehe Tabelle`}
					/>
				) : (
					<InfoBox
						status="info"
						text="Bitte wählen Sie ein Sparfach, um den Kontoauszug anzuzeigen."
					/>
				)}
				{selected ? (
					<>
						<p>
							Aktuelles Guthaben:{" "}
							<MoneyCell
								cents={balance}
								currency={currency}
								bold
							/>
						</p>
						<Table
							columns={columns}
							data={entries}
							rowCount={entries.length}
						/>
					</>
				) : null}
			</div>
		</Page>
	);
};

export default Konto;
