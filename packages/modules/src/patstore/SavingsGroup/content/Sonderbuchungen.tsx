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

const Sonderbuchungen = () => {
	const {
		bookingRows,
		members,
		activeMembers,
		module,
		currency,
		refetch,
		createData
	} = useSavingsGroup();
	const [open, setOpen] = useState(false);
	const [direction, setDirection] = useState<"einnahme" | "ausgabe">(
		"ausgabe"
	);
	const [allMembers, setAllMembers] = useState(false);
	const [date, setDate] = useState(unixToDateInput(nowUnix()));
	const [personId, setPersonId] = useState<string | null>(null);
	const [text, setText] = useState("");
	const [betrag, setBetrag] = useState("");

	const rows = useMemo(
		() =>
			bookingRows
				.filter((row) => row.type === "S")
				.sort((a, b) => (b.data?.wert ?? 0) - (a.data?.wert ?? 0)),
		[bookingRows]
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
				return member ? memberDisplayName(member) : "—";
			},
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
			return window.alert("Der Betrag muss größer 0,00 sein.");
		if (!text.trim())
			return window.alert("Bitte den Verwendungszweck angeben.");
		if (!wert) return window.alert("Bitte ein gültiges Buchdatum angeben.");
		if (!allMembers && !personId)
			return window.alert("Bitte ein Sparfach wählen.");

		const signed = direction === "einnahme" ? -cents : cents;
		const targets = allMembers
			? activeMembers.map((member) => member.personId)
			: [personId as string];

		for (const id of targets) {
			await createParseObject(createData, {
				className: "Booking",
				updateObject: bookingCreatePayload({
					type: "S",
					moduleId: module.objectId,
					personId: id,
					label: text.trim(),
					data: emptyBookingData({
						wert,
						personId: id,
						text: text.trim(),
						sparer: signed
					})
				})
			});
		}
		setOpen(false);
		setText("");
		setBetrag("");
		setPersonId(null);
		await refetch();
	};

	return (
		<Page
			title="Sonderbuchungen"
			description="Umbuchungen zwischen Sparguthaben und Gemeinschaftskasse."
			emptyContent
			refetch={refetch}
			pageHeaderButtons={[
				{
					text: "Sonderbuchung hinzufügen",
					is_add_button: true,
					onClick: () => setOpen(true)
				}
			]}
		>
			<Table columns={columns} data={rows} rowCount={rows.length} />
			<Modal
				isOpen={open}
				header="Neue Sonderbuchung hinzufügen"
				cancelButtonHandler={() => setOpen(false)}
				confirmButtonHandler={save}
				confirmButtonText="Buchen"
			>
				<div className="flex col a-st gap-sm">
					<SwitchButtons
						buttonStates={[
							{
								value: "ausgabe",
								label: "Gutschrift an Mitglied"
							},
							{ value: "einnahme", label: "Belastung Mitglied" }
						]}
						currentStates={{
							value: direction,
							label:
								direction === "ausgabe"
									? "Gutschrift an Mitglied"
									: "Belastung Mitglied"
						}}
						changeHandler={(state) =>
							setDirection(
								state.value === "einnahme"
									? "einnahme"
									: "ausgabe"
							)
						}
					/>
					<InfoBox
						status="info"
						text={
							direction === "ausgabe"
								? "Belastung Gemeinschaftskasse → Gutschrift Sparguthaben"
								: "Belastung Sparguthaben → Gutschrift Gemeinschaftskasse"
						}
					/>
					<SwitchButtons
						buttonStates={[
							{ value: "one", label: "Einzelnes Sparfach" },
							{ value: "all", label: "Alle aktiven Sparfächer" }
						]}
						currentStates={{
							value: allMembers ? "all" : "one",
							label: allMembers
								? "Alle aktiven Sparfächer"
								: "Einzelnes Sparfach"
						}}
						changeHandler={(state) =>
							setAllMembers(state.value === "all")
						}
					/>
					{!allMembers ? (
						<MemberSelect
							members={members}
							value={personId}
							onChange={setPersonId}
						/>
					) : null}
					<DatePicker
						id="sonder-date"
						label="Buchdatum"
						type="date"
						defaultValue={date}
						onChange={setDate}
					/>
					<TextInput
						id="sonder-text"
						label="Verwendungszweck"
						placeholder="z. B. Zinsgutschrift"
						defaultValue={text}
						onChange={setText}
					/>
					<TextInput
						id="sonder-betrag"
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

export default Sonderbuchungen;
