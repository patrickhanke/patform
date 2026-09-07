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
import {
	dateInputToUnix,
	formatCents,
	nowUnix,
	parseEuroToCents,
	unixToDateDe,
	unixToDateInput
} from "../functions/format";
import {
	bookingCreatePayload,
	createParseObject
} from "../functions/bookingApi";
import { emptyBookingData } from "../functions/normalize";
import MoneyCell from "../components/MoneyCell";

const Gemeinschaftskasse = () => {
	const { bookingRows, module, currency, refetch, createData } =
		useSavingsGroup();
	const [open, setOpen] = useState(false);
	const [direction, setDirection] = useState<"einnahme" | "ausgabe">(
		"einnahme"
	);
	const [date, setDate] = useState(unixToDateInput(nowUnix()));
	const [text, setText] = useState("");
	const [betrag, setBetrag] = useState("");

	const rows = useMemo(
		() =>
			bookingRows
				.filter((row) => row.type === "G")
				.sort((a, b) => (b.data?.wert ?? 0) - (a.data?.wert ?? 0)),
		[bookingRows]
	);
	const saldo = rows.reduce(
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
			id: "text",
			header: () => <span>Verwendungszweck</span>,
			accessorFn: (row) => row.data?.text || "",
			cell: (info) => info.getValue()
		},
		{
			id: "betrag",
			header: () => <span>Betrag</span>,
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
		const cents = parseEuroToCents(betrag);
		const wert = dateInputToUnix(date);
		if (cents <= 0)
			return window.alert("Der Betrag muss größer 0,00 sein.");
		if (!text.trim())
			return window.alert("Bitte den Verwendungszweck angeben.");
		if (!wert) return window.alert("Bitte ein gültiges Buchdatum angeben.");
		const signed = direction === "ausgabe" ? -cents : cents;
		await createParseObject(createData, {
			className: "Booking",
			updateObject: bookingCreatePayload({
				type: "G",
				moduleId: module.objectId,
				personId: null,
				label: text.trim(),
				data: emptyBookingData({
					wert,
					text: text.trim(),
					hauptbuch: signed
				})
			}),
			feedback: "Buchung gespeichert"
		});
		setOpen(false);
		setText("");
		setBetrag("");
		await refetch();
	};

	return (
		<Page
			title="Gemeinschaftskasse"
			description="Externe Einnahmen und Ausgaben der Gemeinschaftskasse."
			emptyContent
			refetch={refetch}
			pageHeaderButtons={[
				{
					text: "Buchung hinzufügen",
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
					text={`Saldo dieser Buchungen: ${formatCents(saldo, currency)}`}
				/>
			) : null}
			<Modal
				isOpen={open}
				header="Neue Gemeinschaftskassenbuchung"
				cancelButtonHandler={() => setOpen(false)}
				confirmButtonHandler={save}
				confirmButtonText="Buchen"
			>
				<div className="flex col a-st gap-sm">
					<SwitchButtons
						buttonStates={[
							{ value: "einnahme", label: "Einnahme" },
							{ value: "ausgabe", label: "Ausgabe" }
						]}
						currentStates={{
							value: direction,
							label:
								direction === "einnahme"
									? "Einnahme"
									: "Ausgabe"
						}}
						changeHandler={(state) =>
							setDirection(
								state.value === "ausgabe"
									? "ausgabe"
									: "einnahme"
							)
						}
					/>
					<DatePicker
						id="gk-date"
						label="Buchdatum"
						type="date"
						defaultValue={date}
						onChange={setDate}
					/>
					<TextInput
						id="gk-text"
						label="Verwendungszweck"
						placeholder="z. B. Zinsertrag"
						defaultValue={text}
						onChange={setText}
					/>
					<TextInput
						id="gk-betrag"
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

export default Gemeinschaftskasse;
