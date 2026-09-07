"use client";

import { useMemo, useState } from "react";
import {
	ColumnDef,
	DatePicker,
	InfoBox,
	Modal,
	Page,
	SwitchButtons,
	Table,
	TableColumnDeleteField,
	TextInput
} from "@repo/ui";
import { BookingClass } from "@repo/types";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import { memberBalances } from "../functions/calc";
import {
	centsToInput,
	dateInputToUnix,
	formatCents,
	memberDisplayName,
	nowUnix,
	parseEuroToCents,
	unixToDateDe,
	unixToDateInput
} from "../functions/format";
import {
	bookingCreatePayload,
	createParseObject
} from "../functions/bookingApi";
import { bookingPersonId, emptyBookingData } from "../functions/normalize";
import MemberSelect from "../components/MemberSelect";
import MoneyCell from "../components/MoneyCell";

const Auszahlungen = () => {
	const {
		bookingRows,
		bookings,
		members,
		module,
		currency,
		refetch,
		createData
	} = useSavingsGroup();
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<"single" | "all">("single");
	const [date, setDate] = useState(unixToDateInput(nowUnix()));
	const [personId, setPersonId] = useState<string | null>(null);
	const [betrag, setBetrag] = useState("");

	const balances = useMemo(() => memberBalances(bookings), [bookings]);
	const rows = useMemo(
		() =>
			bookingRows
				.filter((row) => row.type === "A")
				.sort((a, b) => (b.data?.wert ?? 0) - (a.data?.wert ?? 0)),
		[bookingRows]
	);
	const total = rows.reduce(
		(sum, row) => sum + (row.data?.hauptbuch ?? 0),
		0
	);

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
			header: () => <span>Auszahlung</span>,
			accessorFn: (row) => row.data?.hauptbuch ?? 0,
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
		const wert = dateInputToUnix(date);
		if (!wert) return window.alert("Bitte ein gültiges Buchdatum angeben.");

		if (mode === "all") {
			for (const member of members) {
				const credit = balances.get(member.personId) ?? 0;
				if (credit <= 0) continue;
				await createParseObject(createData, {
					className: "Booking",
					updateObject: bookingCreatePayload({
						type: "A",
						moduleId: module.objectId,
						personId: member.personId,
						label: "Auszahlung",
						data: emptyBookingData({
							wert,
							personId: member.personId,
							hauptbuch: -credit,
							sparer: -credit
						})
					})
				});
			}
			setOpen(false);
			await refetch();
			return;
		}

		if (!personId) return window.alert("Bitte ein Sparfach wählen.");
		const credit = parseEuroToCents(betrag);
		const maxCredit = balances.get(personId) ?? 0;
		if (credit === 0)
			return window.alert(
				"Ein Betrag von 0,00 kann nicht ausgezahlt werden."
			);
		if (credit > maxCredit)
			return window.alert(
				"Der Auszahlbetrag ist größer als das Guthaben auf dem Mitgliedskonto."
			);
		await createParseObject(createData, {
			className: "Booking",
			updateObject: bookingCreatePayload({
				type: "A",
				moduleId: module.objectId,
				personId,
				label: "Auszahlung",
				data: emptyBookingData({
					wert,
					personId,
					hauptbuch: -credit,
					sparer: -credit
				})
			}),
			feedback: "Auszahlung gebucht"
		});
		setOpen(false);
		setBetrag("");
		setPersonId(null);
		await refetch();
	};

	return (
		<Page
			title="Auszahlungen"
			description="Auszahlungen verringern das Sparguthaben und entnehmen den Betrag dem Vereinskonto."
			emptyContent
			refetch={refetch}
			pageHeaderButtons={[
				{
					text: "Auszahlung hinzufügen",
					is_add_button: true,
					onClick: () => setOpen(true)
				}
			]}
		>
			<Table columns={columns} data={rows} rowCount={rows.length} />
			{rows.length > 0 ? (
				<InfoBox
					status="info"
					maxWidth="100%"
					text={`Summe Auszahlungen: ${formatCents(total, currency)}`}
				/>
			) : null}
			<Modal
				isOpen={open}
				header="Neue Auszahlung hinzufügen"
				cancelButtonHandler={() => setOpen(false)}
				confirmButtonHandler={save}
				confirmButtonText="Buchen"
			>
				<div className="flex col a-st gap-sm">
					<SwitchButtons
						buttonStates={[
							{ value: "single", label: "Einzelnes Sparfach" },
							{ value: "all", label: "Alle Fächer mit Guthaben" }
						]}
						currentStates={{
							value: mode,
							label:
								mode === "single"
									? "Einzelnes Sparfach"
									: "Alle Fächer mit Guthaben"
						}}
						changeHandler={(state) =>
							setMode(state.value === "all" ? "all" : "single")
						}
					/>
					<DatePicker
						id="auszahlung-date"
						label="Buchdatum"
						type="date"
						defaultValue={date}
						onChange={setDate}
					/>
					{mode === "single" ? (
						<>
							<MemberSelect
								members={members}
								value={personId}
								onChange={(id) => {
									setPersonId(id);
									if (id) {
										const credit = balances.get(id) ?? 0;
										setBetrag(
											credit > 0
												? centsToInput(credit)
												: "0,00"
										);
									}
								}}
								subtitle={(member) =>
									`Guthaben: ${formatCents(balances.get(member.personId) ?? 0, currency)}`
								}
							/>
							<TextInput
								id="auszahlung-betrag"
								label="Betrag"
								defaultValue={betrag}
								onChange={setBetrag}
							/>
						</>
					) : (
						<InfoBox
							status="info"
							text="Für jedes Sparfach mit positivem Guthaben wird das komplette Guthaben ausgezahlt."
						/>
					)}
				</div>
			</Modal>
		</Page>
	);
};

export default Auszahlungen;
