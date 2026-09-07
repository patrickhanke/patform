"use client";

import { useMemo, useState } from "react";
import {
	ColumnDef,
	DatePicker,
	InfoBox,
	Page,
	Select,
	SlideIn,
	SwitchButtons,
	Table,
	TextInput,
	usePageData
} from "@repo/ui";
import { SavingsGroupMember, SavingsGroupModuleData } from "@repo/types";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import { savingsGroupUpdateOptions } from "../functions/updateOptions";
import { emptyMember } from "../functions/normalize";
import { memberBalances } from "../functions/calc";
import { memberDisplayName } from "../functions/format";
import {
	createParseObject,
	personCreatePayload
} from "../functions/bookingApi";
import MoneyCell from "../components/MoneyCell";

const Sparfachbelegung = () => {
	const {
		module,
		moduleData,
		members: contextMembers,
		people,
		bookings,
		currency,
		refetch,
		createData,
		updateData,
		peopleModuleId
	} = useSavingsGroup();
	const { data, setData } = usePageData<SavingsGroupModuleData>(
		{ initialData: moduleData, objectId: module.objectId },
		savingsGroupUpdateOptions(module)
	);
	const [search, setSearch] = useState("");
	const [editing, setEditing] = useState<SavingsGroupMember | null>(null);
	const [isNew, setIsNew] = useState(false);

	const members = data?.members ?? contextMembers;
	const balances = useMemo(() => memberBalances(bookings), [bookings]);

	const rows = useMemo(() => {
		const query = search.trim().toLowerCase();
		return members.filter((member) => {
			if (!query) return true;
			const name = memberDisplayName(member).toLowerCase();
			return (
				name.includes(query) ||
				member.sparfach.toLowerCase().includes(query) ||
				member.lottozahl.toLowerCase().includes(query) ||
				(member.city || "").toLowerCase().includes(query)
			);
		});
	}, [members, search]);

	const columns: ColumnDef<SavingsGroupMember>[] = [
		{
			id: "sparfach",
			header: () => <span>Fach</span>,
			accessorFn: (row) => row.sparfach || "–",
			cell: (info) => <strong>{String(info.getValue())}</strong>
		},
		{
			id: "name",
			header: () => <span>Name</span>,
			accessorFn: (row) => memberDisplayName(row) || "(ohne Namen)",
			cell: (info) => info.getValue()
		},
		{
			id: "lotto",
			header: () => <span>Lotto</span>,
			accessorFn: (row) => row.lottozahl || "–",
			cell: (info) => info.getValue()
		},
		{
			id: "city",
			header: () => <span>Ort</span>,
			accessorFn: (row) => row.city || "–",
			cell: (info) => info.getValue()
		},
		{
			id: "status",
			header: () => <span>Status</span>,
			accessorFn: (row) => (row.status >= 1 ? "Aktiv" : "Aus"),
			cell: (info) => info.getValue()
		},
		{
			id: "saldo",
			header: () => <span>Guthaben</span>,
			accessorFn: (row) => balances.get(row.personId) ?? 0,
			cell: (info) => (
				<MoneyCell
					cents={info.getValue() as number}
					currency={currency}
				/>
			)
		},
		{
			id: "edit",
			header: () => <span></span>,
			accessorFn: (row) => row,
			cell: (info) => (
				<button
					className="full_button sm"
					type="button"
					onClick={() => {
						setEditing({
							...(info.getValue() as SavingsGroupMember)
						});
						setIsNew(false);
					}}
				>
					Bearbeiten
				</button>
			)
		}
	];

	const saveMember = async () => {
		if (!editing || !data) return;
		let next = { ...editing };
		if (!next.personId) {
			const created = await createParseObject(createData, {
				className: "Person",
				updateObject: personCreatePayload({
					member: next,
					moduleId: peopleModuleId || module.objectId
				})
			});
			if (!created?.objectId) return;
			next = { ...next, personId: created.objectId };
		} else {
			await updateData({
				className: "Person",
				objectId: next.personId,
				updateObject: {
					name: memberDisplayName(next) || "Mitglied",
					label: memberDisplayName(next) || "Mitglied",
					email: next.email || ""
				}
			});
		}

		const index = data.members.findIndex(
			(member) => member.personId && member.personId === next.personId
		);
		const nextMembers =
			index >= 0
				? data.members.map((member, memberIndex) =>
						memberIndex === index ? next : member
					)
				: [...data.members, next];
		setData("members", nextMembers);
		setEditing(null);
	};

	const removeMember = () => {
		if (!editing || !data) return;
		const hasBookings = bookings.some(
			(booking) => booking.personId === editing.personId
		);
		if (hasBookings) {
			window.alert(
				"Für dieses Sparfach sind bereits Buchungen vorhanden. Es kann nicht gelöscht werden."
			);
			return;
		}
		if (!window.confirm("Möchten Sie dieses Sparfach wirklich löschen?")) {
			return;
		}
		setData(
			"members",
			data.members.filter(
				(member) => member.personId !== editing.personId
			)
		);
		setEditing(null);
	};

	return (
		<Page
			title="Sparfachbelegung"
			description={`${members.length} Sparfächer · ${members.filter((member) => member.status >= 1).length} aktiv`}
			emptyContent
			refetch={refetch}
			pageHeaderButtons={[
				{
					text: "Sparfach hinzufügen",
					is_add_button: true,
					onClick: () => {
						setEditing(emptyMember());
						setIsNew(true);
					}
				}
			]}
		>
			<div className="flex col a-st gap-sm">
				<TextInput
					id="member-search"
					label="Suchen"
					placeholder="Name, Fach, Ort, Lottozahl…"
					defaultValue={search}
					onChange={setSearch}
					width="320px"
				/>
				<Table columns={columns} data={rows} rowCount={rows.length} />
			</div>
			<SlideIn
				isOpen={editing != null}
				header={isNew ? "Sparfach hinzufügen" : "Sparfach bearbeiten"}
				cancel={() => setEditing(null)}
				confirm={saveMember}
				confirmText="Übernehmen"
			>
				{editing ? (
					<MemberForm
						member={editing}
						people={people}
						onChange={setEditing}
						onDelete={isNew ? undefined : removeMember}
					/>
				) : null}
			</SlideIn>
		</Page>
	);
};

const MemberForm = ({
	member,
	people,
	onChange,
	onDelete
}: {
	member: SavingsGroupMember;
	people: { objectId: string; name?: string; email?: string }[];
	onChange: (member: SavingsGroupMember) => void;
	onDelete?: () => void;
}) => {
	const set = (patch: Partial<SavingsGroupMember>) =>
		onChange({ ...member, ...patch });

	return (
		<div className="flex col a-st gap-sm">
			<h3>Sparfach</h3>
			<SwitchButtons
				buttonStates={[
					{ value: 1, label: "Sparen" },
					{ value: 0, label: "Ausgetreten" }
				]}
				currentStates={{
					value: member.status >= 1 ? 1 : 0,
					label: member.status >= 1 ? "Sparen" : "Ausgetreten"
				}}
				changeHandler={(state) => set({ status: Number(state.value) })}
			/>
			<TextInput
				id="member-sparfach"
				label="Sparfach"
				defaultValue={member.sparfach}
				onChange={(value) => set({ sparfach: value })}
			/>
			<TextInput
				id="member-lotto"
				label="Lottozahl"
				defaultValue={member.lottozahl}
				onChange={(value) => set({ lottozahl: value })}
			/>
			<h3>Mitglied</h3>
			<Select
				id="member-person"
				label="Bestehende Person verbinden"
				placeholder="Person wählen…"
				isClearable
				width={260}
				value={member.personId || null}
				options={people.map((person) => ({
					value: person.objectId,
					label: person.name || person.email || person.objectId
				}))}
				onChange={(
					option: { value?: string; label?: string } | null
				) => {
					if (!option?.value) {
						set({ personId: "" });
						return;
					}
					const [firstName, ...rest] = (option.label || "").split(
						" "
					);
					set({
						personId: String(option.value),
						firstName: firstName || member.firstName,
						lastName: rest.join(" ") || member.lastName
					});
				}}
			/>
			<SwitchButtons
				buttonStates={[
					{ value: "0", label: "—" },
					{ value: "1", label: "Frau" },
					{ value: "2", label: "Herr" }
				]}
				currentStates={{
					value: member.salutation || "0",
					label:
						member.salutation === "1"
							? "Frau"
							: member.salutation === "2"
								? "Herr"
								: "—"
				}}
				changeHandler={(state) =>
					set({ salutation: String(state.value) })
				}
			/>
			<TextInput
				id="member-first"
				label="Vorname"
				defaultValue={member.firstName || ""}
				onChange={(value) => set({ firstName: value })}
			/>
			<TextInput
				id="member-last"
				label="Nachname"
				defaultValue={member.lastName || ""}
				onChange={(value) => set({ lastName: value })}
			/>
			<TextInput
				id="member-street"
				label="Strasse"
				defaultValue={member.street || ""}
				onChange={(value) => set({ street: value })}
			/>
			<TextInput
				id="member-hn"
				label="Hausnummer"
				defaultValue={member.houseNumber || ""}
				onChange={(value) => set({ houseNumber: value })}
			/>
			<TextInput
				id="member-zip"
				label="PLZ"
				defaultValue={member.zip || ""}
				onChange={(value) => set({ zip: value })}
			/>
			<TextInput
				id="member-city"
				label="Ort"
				defaultValue={member.city || ""}
				onChange={(value) => set({ city: value })}
			/>
			<DatePicker
				id="member-birthday"
				label="Geburtstag"
				type="date"
				defaultValue={member.birthday || ""}
				onChange={(value) => set({ birthday: value })}
			/>
			<h3>Kontakt</h3>
			<TextInput
				id="member-email"
				label="E-Mail"
				type="email"
				defaultValue={member.email || ""}
				onChange={(value) => set({ email: value })}
			/>
			<TextInput
				id="member-phone"
				label="Telefon"
				defaultValue={member.phone || ""}
				onChange={(value) => set({ phone: value })}
			/>
			<TextInput
				id="member-mobile"
				label="Mobil"
				defaultValue={member.mobile || ""}
				onChange={(value) => set({ mobile: value })}
			/>
			<TextInput
				id="member-note"
				label="Bemerkung"
				isTextArea
				defaultValue={member.note || ""}
				onChange={(value) => set({ note: value })}
			/>
			{onDelete ? (
				<button
					type="button"
					className="full_button sm"
					onClick={onDelete}
				>
					Sparfach löschen
				</button>
			) : (
				<InfoBox
					status="info"
					text="Neue Personen werden beim Übernehmen angelegt. Speichern Sie danach die Moduldaten."
				/>
			)}
		</div>
	);
};

export default Sparfachbelegung;
