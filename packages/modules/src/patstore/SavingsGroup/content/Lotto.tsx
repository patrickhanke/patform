"use client";

import { useMemo, useState } from "react";
import {
	ColumnDef,
	DatePicker,
	InfoBox,
	Modal,
	Page,
	Table,
	TableColumnDeleteField,
	TextInput
} from "@repo/ui";
import { BookingClass } from "@repo/types";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import {
	dateInputToUnix,
	nowUnix,
	parseEuroToCents,
	unixToDateDe,
	unixToDateInput,
	formatCents
} from "../functions/format";
import { memberDisplayName } from "../functions/format";
import {
	bookingCreatePayload,
	createParseObject
} from "../functions/bookingApi";
import { bookingPersonId, emptyBookingData } from "../functions/normalize";
import MemberSelect from "../components/MemberSelect";
import MoneyCell from "../components/MoneyCell";

const Lotto = () => {
	const { bookingRows, members, module, currency, refetch, createData } =
		useSavingsGroup();
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState(unixToDateInput(nowUnix()));
	const [personId, setPersonId] = useState<string | null>(null);
	const [betrag, setBetrag] = useState("");

	const rows = useMemo(
		() =>
			bookingRows
				.filter((row) => row.type === "T")
				.sort((a, b) => (b.data?.wert ?? 0) - (a.data?.wert ?? 0)),
		[bookingRows]
	);
	const total = rows.reduce((sum, row) => sum + (row.data?.sparer ?? 0), 0);

	const columns: ColumnDef<BookingClass>[] = [
		{
			id: "date",
			header: () => <span>Datum</span>,
			accessorFn: (row) => unixToDateDe(row.data?.wert),
			cell: (info) => info.getValue()
		},
		{
			id: "fach",
			header: () => <span>Fach</span>,
			accessorFn: (row) =>
				members.find(
					(member) => member.personId === bookingPersonId(row)
				)?.sparfach || "–",
			cell: (info) => <strong>{String(info.getValue())}</strong>
		},
		{
			id: "name",
			header: () => <span>Mitglied</span>,
			accessorFn: (row) => {
				const member = members.find(
					(item) => item.personId === bookingPersonId(row)
				);
				return member ? memberDisplayName(member, true) : "—";
			},
			cell: (info) => info.getValue()
		},
		{
			id: "betrag",
			header: () => <span>Gewinn</span>,
			accessorFn: (row) => row.data?.sparer ?? 0,
			cell: (info) => (
				<MoneyCell
					cents={info.getValue() as number}
					currency={currency}
				/>
			)
		},
		{
			id: "delete",
			header: () => <span></span>,
			accessorFn: (row) => row.objectId,
			cell: (info) => (
				<TableColumnDeleteField
					objectId={String(info.getValue())}
					className="Booking"
					refetch={refetch}
				/>
			)
		}
	];

	const save = async () => {
		const cents = parseEuroToCents(betrag);
		const wert = dateInputToUnix(date);
		if (cents <= 0)
			return window.alert("Betrag muss größer als 0,00 sein.");
		if (!wert) return window.alert("Bitte ein gültiges Datum angeben.");
		if (!personId) return window.alert("Bitte ein Sparfach wählen.");
		await createParseObject(createData, {
			className: "Booking",
			updateObject: bookingCreatePayload({
				type: "T",
				moduleId: module.objectId,
				personId,
				label: "Lottogewinn",
				data: emptyBookingData({
					wert,
					personId,
					sparer: cents,
					lotto: -cents
				})
			}),
			feedback: "Lottogewinn gebucht"
		});
		setOpen(false);
		setBetrag("");
		setPersonId(null);
		await refetch();
	};

	return (
		<Page
			title="Lottogewinne"
			description="Lottogewinne werden dem Sparguthaben gutgeschrieben und der Gemeinschaftskasse belastet."
			emptyContent
			refetch={refetch}
			pageHeaderButtons={[
				{
					text: "Lottogewinn hinzufügen",
					is_add_button: true,
					onClick: () => setOpen(true)
				}
			]}
		>
			<Table columns={columns} data={rows} rowCount={rows.length} />
			{rows.length > 0 ? (
				<InfoBox
					status="success"
					maxWidth="100%"
					text={`Summe Lottogewinne: ${formatCents(total, currency)}`}
				/>
			) : null}
			<Modal
				isOpen={open}
				header="Neuen Lottogewinn hinzufügen"
				cancelButtonHandler={() => setOpen(false)}
				confirmButtonHandler={save}
				confirmButtonText="Buchen"
			>
				<div className="flex col a-st gap-sm">
					<DatePicker
						id="lotto-date"
						label="Buchdatum"
						type="date"
						defaultValue={date}
						onChange={setDate}
					/>
					<MemberSelect
						members={members}
						value={personId}
						onChange={setPersonId}
					/>
					<TextInput
						id="lotto-betrag"
						label="Betrag"
						placeholder="0,00"
						defaultValue={betrag}
						onChange={setBetrag}
					/>
				</div>
			</Modal>
		</Page>
	);
};

export default Lotto;
