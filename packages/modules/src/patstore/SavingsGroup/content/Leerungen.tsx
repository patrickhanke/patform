"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	ColumnDef,
	DatePicker,
	InfoBox,
	Modal,
	Page,
	Table,
	TextInput,
	usePageData
} from "@repo/ui";
import { BookingClass, BookingData } from "@repo/types";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import {
	applySavingRule,
	emptyingDates,
	emptyingSummaries,
	lastEmptying,
	pocketSort
} from "../functions/calc";
import {
	centsToInput,
	dateInputToUnix,
	nowUnix,
	parseEuroToCents,
	unixToDateDe,
	unixToDateDeFull,
	unixToDateInput
} from "../functions/format";
import {
	bookingCreatePayload,
	createParseObject
} from "../functions/bookingApi";
import { emptyBookingData, bookingPersonId } from "../functions/normalize";
import { memberDisplayName } from "../functions/format";
import MoneyCell from "../components/MoneyCell";

const Leerungen = () => {
	const searchParams = useSearchParams();
	const wert = Number(searchParams.get("wert") || 0);
	if (wert > 0) {
		return <LeerungEditor wert={wert} />;
	}
	return <LeerungList />;
};

const LeerungList = () => {
	const router = useRouter();
	const { bookings, activeMembers, refetch, createData, module, currency } =
		useSavingsGroup();
	const [addOpen, setAddOpen] = useState(false);
	const [date, setDate] = useState(unixToDateInput(nowUnix()));

	const summaries = useMemo(() => emptyingSummaries(bookings), [bookings]);

	const columns: ColumnDef<(typeof summaries)[number]>[] = [
		{
			id: "date",
			header: () => <span>Leerung vom …</span>,
			accessorFn: (row) => unixToDateDe(row.wert),
			cell: (info) => info.getValue()
		},
		{
			id: "einwurf",
			header: () => <span>Einwurf</span>,
			accessorFn: (row) => row.einwurf,
			cell: (info) => (
				<MoneyCell
					cents={info.getValue() as number}
					currency={currency}
					colored={false}
				/>
			)
		},
		{
			id: "sparclub",
			header: () => <span>Sparclub</span>,
			accessorFn: (row) => row.sparclub,
			cell: (info) => (
				<MoneyCell
					cents={-(info.getValue() as number)}
					currency={currency}
				/>
			)
		},
		{
			id: "lotto",
			header: () => <span>Lotto</span>,
			accessorFn: (row) => row.lotto,
			cell: (info) => (
				<MoneyCell
					cents={-(info.getValue() as number)}
					currency={currency}
				/>
			)
		},
		{
			id: "strafgeld",
			header: () => <span>Strafgeld</span>,
			accessorFn: (row) => row.strafgeld,
			cell: (info) => (
				<MoneyCell
					cents={-(info.getValue() as number)}
					currency={currency}
				/>
			)
		},
		{
			id: "sparer",
			header: () => <span>Gespart</span>,
			accessorFn: (row) => row.sparer,
			cell: (info) => (
				<MoneyCell
					cents={info.getValue() as number}
					currency={currency}
					bold
				/>
			)
		},
		{
			id: "open",
			header: () => <span></span>,
			accessorFn: (row) => row.wert,
			cell: (info) => (
				<button
					type="button"
					className="full_button sm"
					onClick={() =>
						router.push(
							`/savings-group/leerungen?wert=${info.getValue()}`
						)
					}
				>
					Öffnen
				</button>
			)
		}
	];

	const create = async () => {
		const nextWert = dateInputToUnix(date);
		if (!nextWert) {
			window.alert("Bitte ein gültiges Datum angeben.");
			return;
		}
		if (emptyingDates(bookings).includes(nextWert)) {
			window.alert(
				"An diesem Tag ist bereits eine Sparkastenleerung vorhanden."
			);
			return;
		}
		if (activeMembers.length === 0) {
			window.alert(
				"Es muss mindestens ein aktives Sparfach angelegt sein."
			);
			return;
		}

		const last = lastEmptying(bookings);
		const vgMap = new Map<string, number>();
		if (last) {
			for (const booking of bookings) {
				if (
					booking.type === "L" &&
					booking.wert === last &&
					booking.personId
				) {
					vgMap.set(
						booking.personId,
						Math.max(0, (booking.vg ?? 0) - 1)
					);
				}
			}
		}

		for (const member of activeMembers) {
			await createParseObject(createData, {
				className: "Booking",
				updateObject: bookingCreatePayload({
					type: "L",
					moduleId: module.objectId,
					personId: member.personId,
					label: `Leerung ${unixToDateDe(nextWert)}`,
					data: emptyBookingData({
						wert: nextWert,
						personId: member.personId,
						hauptbuch: 0,
						sparer: 0,
						einwurf: 0,
						sparclub: 0,
						lotto: 0,
						strafgeld: 0,
						vg: vgMap.get(member.personId) ?? 0
					})
				})
			});
		}
		setAddOpen(false);
		await refetch();
		router.push(`/savings-group/leerungen?wert=${nextWert}`);
	};

	return (
		<Page
			title="Sparkastenleerungen"
			description="Zusammenfassung aller Sparkastenleerungen."
			emptyContent
			refetch={refetch}
			pageHeaderButtons={[
				{
					text: "Leerung hinzufügen",
					is_add_button: true,
					onClick: () => {
						setDate(unixToDateInput(nowUnix()));
						setAddOpen(true);
					}
				}
			]}
		>
			<Table
				columns={columns}
				data={summaries}
				rowCount={summaries.length}
			/>
			<Modal
				isOpen={addOpen}
				header="Datum der neuen Leerung"
				cancelButtonHandler={() => setAddOpen(false)}
				confirmButtonHandler={create}
				confirmButtonText="Leerung anlegen"
			>
				<DatePicker
					id="leerung-date"
					label="Leerungsdatum"
					type="date"
					defaultValue={date}
					onChange={setDate}
				/>
			</Modal>
		</Page>
	);
};

const LeerungEditor = ({ wert }: { wert: number }) => {
	const router = useRouter();
	const { bookingRows, members, savingRule, currency, refetch, deleteData } =
		useSavingsGroup();

	const initialRows = useMemo(
		() =>
			bookingRows
				.filter(
					(row) => row.type === "L" && (row.data?.wert ?? 0) === wert
				)
				.sort((a, b) => {
					const memberA = members.find(
						(member) => member.personId === bookingPersonId(a)
					);
					const memberB = members.find(
						(member) => member.personId === bookingPersonId(b)
					);
					return pocketSort(
						memberA?.sparfach || "",
						memberB?.sparfach || ""
					);
				}),
		[bookingRows, members, wert]
	);

	const { data, setRowData } = usePageData<BookingClass[]>(
		{ initialData: initialRows },
		{
			className: "Booking",
			collection: true,
			updateObject: (rows) => ({
				data: rows
			}),
			message: "Leerung gespeichert"
		}
	);

	const rows = data ?? initialRows;

	const updateEinwurf = (row: BookingClass, text: string) => {
		const einwurf = parseEuroToCents(text);
		const member = members.find(
			(item) => item.personId === (bookingPersonId(row) || "")
		);
		const parts = applySavingRule(
			einwurf,
			Boolean(member?.lottozahl?.trim()),
			row.data?.vg ?? 0,
			savingRule
		);
		const nextData: BookingData = {
			...row.data,
			einwurf,
			sparclub: parts.sparclub,
			lotto: parts.lotto,
			strafgeld: parts.strafgeld,
			sparer: parts.sparer,
			hauptbuch: einwurf
		};
		setRowData(row.objectId, "data", nextData);
	};

	const updateVg = (row: BookingClass, text: string) => {
		const vg = Math.max(0, parseInt(text || "0", 10) || 0);
		const member = members.find(
			(item) => item.personId === (bookingPersonId(row) || "")
		);
		const einwurf = row.data?.einwurf ?? 0;
		const parts = applySavingRule(
			einwurf,
			Boolean(member?.lottozahl?.trim()),
			vg,
			savingRule
		);
		setRowData(row.objectId, "data", {
			...row.data,
			vg,
			sparclub: parts.sparclub,
			lotto: parts.lotto,
			strafgeld: parts.strafgeld,
			sparer: parts.sparer,
			hauptbuch: einwurf
		});
	};

	const totals = rows.reduce(
		(acc, row) => ({
			einwurf: acc.einwurf + (row.data?.einwurf ?? 0),
			sparclub: acc.sparclub + (row.data?.sparclub ?? 0),
			lotto: acc.lotto + (row.data?.lotto ?? 0),
			strafgeld: acc.strafgeld + (row.data?.strafgeld ?? 0),
			sparer: acc.sparer + (row.data?.sparer ?? 0)
		}),
		{ einwurf: 0, sparclub: 0, lotto: 0, strafgeld: 0, sparer: 0 }
	);

	const columns: ColumnDef<BookingClass>[] = [
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
			header: () => <span>Name</span>,
			accessorFn: (row) => {
				const member = members.find(
					(item) => item.personId === bookingPersonId(row)
				);
				return member ? memberDisplayName(member, true) : "—";
			},
			cell: (info) => info.getValue()
		},
		{
			id: "einwurf",
			header: () => <span>Einwurf</span>,
			accessorFn: (row) => row,
			cell: (info) => {
				const row = info.getValue() as BookingClass;
				return (
					<TextInput
						id={`einwurf-${row.objectId}`}
						defaultValue={centsToInput(row.data?.einwurf)}
						onChange={(value) => updateEinwurf(row, value)}
						width="90px"
					/>
				);
			}
		},
		{
			id: "sparclub",
			header: () => <span>Sparclub</span>,
			accessorFn: (row) => row.data?.sparclub ?? 0,
			cell: (info) => (
				<MoneyCell
					cents={-(info.getValue() as number)}
					currency={currency}
				/>
			)
		},
		{
			id: "lotto",
			header: () => <span>Lotto</span>,
			accessorFn: (row) => row.data?.lotto ?? 0,
			cell: (info) => (
				<MoneyCell
					cents={-(info.getValue() as number)}
					currency={currency}
				/>
			)
		},
		{
			id: "strafgeld",
			header: () => <span>Strafgeld</span>,
			accessorFn: (row) => row.data?.strafgeld ?? 0,
			cell: (info) => (
				<MoneyCell
					cents={-(info.getValue() as number)}
					currency={currency}
				/>
			)
		},
		{
			id: "sparer",
			header: () => <span>Gespart</span>,
			accessorFn: (row) => row.data?.sparer ?? 0,
			cell: (info) => (
				<MoneyCell
					cents={info.getValue() as number}
					currency={currency}
					bold
				/>
			)
		},
		{
			id: "vg",
			header: () => <span>VG</span>,
			accessorFn: (row) => row,
			cell: (info) => {
				const row = info.getValue() as BookingClass;
				return (
					<TextInput
						id={`vg-${row.objectId}`}
						defaultValue={String(row.data?.vg ?? 0)}
						onChange={(value) => updateVg(row, value)}
						width="56px"
					/>
				);
			}
		}
	];

	const remove = async () => {
		if (
			!window.confirm(
				"Möchten Sie diese Sparkastenleerung wirklich löschen?"
			)
		) {
			return;
		}
		await Promise.all(
			rows.map((row) =>
				deleteData({ className: "Booking", objectId: row.objectId })
			)
		);
		await refetch();
		router.push("/savings-group/leerungen");
	};

	return (
		<Page
			title={`Sparkastenleerung vom ${unixToDateDeFull(wert)}`}
			description="Sparclub-, Lotto- und Strafgeldbeiträge werden automatisch nach den Sparregeln berechnet."
			emptyContent
			refetch={refetch}
			pageHeaderButtons={[
				{
					text: "Zurück",
					onClick: () => router.push("/savings-group/leerungen")
				},
				{
					text: "Löschen",
					color: "danger",
					onClick: remove
				}
			]}
		>
			<InfoBox
				status="info"
				maxWidth="100%"
				text={`Summe Einwurf ${centsToInput(totals.einwurf)} · Gespart ${centsToInput(totals.sparer)}`}
			/>
			<Table columns={columns} data={rows} rowCount={rows.length} />
		</Page>
	);
};

export default Leerungen;
