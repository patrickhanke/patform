"use client";

import { FC, useMemo, useState } from "react";
import { ClubClass } from "@repo/types";
import {
	Button,
	ColumnDef,
	CreateButton,
	IconButton,
	Modal,
	Select,
	SlideIn,
	Table,
	usePageData
} from "@repo/ui";
import { ClubSignupRow, ClubTabProps } from "../types";
import useClubSignups from "../hooks/useClubSignups";
import { personName } from "../functions/personName";
import {
	canSubmitSignup,
	isSignupLocked,
	signupStatusLabel
} from "../functions/signupStatus";
import { selectString } from "../../../Championship/ChampionshipDetail/functions/selectValue";
import EditTeam from "./EditTeam";

const SignUps: FC<ClubTabProps> = ({ related }) => {
	const { data: club } = usePageData<ClubClass>();
	const {
		rows,
		loading,
		patchSignup,
		createOpenSignup,
		deleteSignup,
		openChampionships
	} = useClubSignups(club, related.championships, related.refetchChampionships);

	const [season, setSeason] = useState("");
	const [createOpen, setCreateOpen] = useState(false);
	const [selectedChampionshipId, setSelectedChampionshipId] = useState("");
	const [selectedClass, setSelectedClass] = useState("");
	const [editRow, setEditRow] = useState<ClubSignupRow | null>(null);
	const [infoRow, setInfoRow] = useState<ClubSignupRow | null>(null);
	const [submitRow, setSubmitRow] = useState<ClubSignupRow | null>(null);
	const [reeditRow, setReeditRow] = useState<ClubSignupRow | null>(null);
	const [deleteRow, setDeleteRow] = useState<ClubSignupRow | null>(null);

	const seasonOptions = useMemo(() => {
		const values = Array.from(
			new Set(
				related.championships
					.map((item) => item.season)
					.filter((item): item is string => Boolean(item))
			)
		);
		return values.map((value) => ({ value, label: value }));
	}, [related.championships]);

	const filteredRows = season
		? rows.filter((row) => row.championshipSeason === season)
		: rows;

	const championshipOptions = openChampionships.map((item) => ({
		value: item.objectId,
		label: item.title,
		classes: item.classes || []
	}));
	const selectedChampionship = openChampionships.find(
		(item) => item.objectId === selectedChampionshipId
	);
	const classOptions = (selectedChampionship?.classes || []).map((item) => ({
		value: item,
		label: item
	}));

	const personById = (id?: string) =>
		related.people.find((person) => person.objectId === id);

	const columns: ColumnDef<ClubSignupRow>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row.championshipTitle,
				header: () => <span>Wettkampf</span>,
				id: "championship",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.class || "—",
				header: () => <span>Spielklasse</span>,
				id: "class",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.number,
				header: () => <span>MS-Nr</span>,
				id: "number",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<IconButton
						icon="view"
						text="Infos"
						onClick={() => setInfoRow(row)}
					/>
				),
				header: () => <span>Info</span>,
				id: "info",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					row.championshipDeadline
						? new Date(row.championshipDeadline).toLocaleDateString(
								"de-DE"
							)
						: "Keine Meldefrist angegeben",
				header: () => <span>Meldefrist</span>,
				id: "deadline",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => {
					if (isSignupLocked(row.status)) {
						return (
							<div className="flex col a-st gap-sm">
								<span>{signupStatusLabel(row.status)}</span>
								{row.status === "gemeldet" &&
									!row.championshipFreeSignup && (
										<Button
											text="Nachträglich bearbeiten"
											maxWidth={220}
											onClick={() => setReeditRow(row)}
										/>
									)}
							</div>
						);
					}
					if (!canSubmitSignup(row.personIds, row.captainId)) {
						return (
							<p>
								Ein Team muss über mindestens 3 Spieler*innen
								und eine*n Spielführer*in verfügen, bevor sie
								gemeldet werden kann
							</p>
						);
					}
					return (
						<Button
							text="Diese Mannschaft melden"
							maxWidth={220}
							onClick={() => setSubmitRow(row)}
						/>
					);
				},
				header: () => <span>Melden</span>,
				id: "signup",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<div className="button_container">
						<IconButton
							icon="edit"
							disabled={isSignupLocked(row.status)}
							onClick={() => setEditRow(row)}
						/>
						{row.openSignup ? (
							<IconButton
								icon="delete"
								color="secondary"
								onClick={() => setDeleteRow(row)}
							/>
						) : null}
					</div>
				),
				header: () => <span>Bearbeiten</span>,
				id: "edit",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[]
	);

	if (!club) {
		return null;
	}

	return (
		<div className="flex col a-st gap-sm">
			<div className="flex row a-ce j-sb gap-sm" style={{ flexWrap: "wrap" }}>
				{seasonOptions.length > 0 ? (
					<Select
						id="signup-season"
						label="Saison"
						isClearable
						options={seasonOptions}
						value={
							seasonOptions.find(
								(option) => option.value === season
							) || null
						}
						onChange={(option) => setSeason(selectString(option))}
					/>
				) : null}
				{openChampionships.length > 0 ? (
					<CreateButton
						text={`Offene Meldungen (${openChampionships.length})`}
						size="small"
						onClick={() => setCreateOpen(true)}
					/>
				) : null}
			</div>
			<Table columns={columns} data={filteredRows} />
			<SlideIn
				header="Offene Meldung hinzufügen"
				isOpen={createOpen}
				cancel={() => setCreateOpen(false)}
				confirm={async () => {
					if (!selectedChampionshipId || !selectedClass) {
						return;
					}
					await createOpenSignup(selectedChampionshipId, selectedClass);
					setCreateOpen(false);
					setSelectedChampionshipId("");
					setSelectedClass("");
				}}
				confirmText="Hinzufügen"
				disabled={[false, !selectedChampionshipId || !selectedClass]}
			>
				<div className="flex col a-st gap-sm">
					<Select
						id="open-championship"
						label="Wettkampf"
						options={championshipOptions}
						value={
							championshipOptions.find(
								(option) =>
									option.value === selectedChampionshipId
							) || null
						}
						onChange={(option) => {
							setSelectedChampionshipId(selectString(option));
							setSelectedClass("");
						}}
					/>
					<Select
						id="open-class"
						label="Spielklasse"
						isDisabled={!selectedChampionshipId}
						options={classOptions}
						value={
							classOptions.find(
								(option) => option.value === selectedClass
							) || null
						}
						onChange={(option) =>
							setSelectedClass(selectString(option))
						}
					/>
				</div>
			</SlideIn>
			<SlideIn
				header={
					editRow
						? `${editRow.championshipTitle} — Mannschaft-Nr: ${editRow.number}`
						: "Mannschaft bearbeiten"
				}
				isOpen={Boolean(editRow)}
				cancel={() => setEditRow(null)}
				confirm={() => setEditRow(null)}
				confirmText="Schließen"
			>
				{editRow ? (
					<EditTeam
						signup={editRow}
						people={related.people}
						clubPlayerIds={club.playerIds || []}
						onClose={() => setEditRow(null)}
						onSave={(patch) =>
							patchSignup(
								editRow.championshipId,
								editRow.id,
								patch,
								"Meldung aktualisiert"
							)
						}
					/>
				) : null}
			</SlideIn>
			<SlideIn
				header="Meldungsinfo"
				isOpen={Boolean(infoRow)}
				cancel={() => setInfoRow(null)}
				confirm={() => setInfoRow(null)}
				confirmText="Schließen"
			>
				{infoRow ? (
					<div className="flex col a-st gap-sm">
						<h3>{infoRow.championshipTitle}</h3>
						<p>Saison: {infoRow.championshipSeason || "—"}</p>
						<p>Spielklasse: {infoRow.class || "—"}</p>
						<p>
							Meldefrist:{" "}
							{infoRow.championshipDeadline
								? new Date(
										infoRow.championshipDeadline
									).toLocaleDateString("de-DE")
								: "—"}
						</p>
						<p>Status: {signupStatusLabel(infoRow.status)}</p>
						<p>
							Spieler*innen:{" "}
							{infoRow.personIds
								.map((id) => personName(personById(id)))
								.filter(Boolean)
								.join(", ") || "—"}
						</p>
						<p>
							Betreuer:{" "}
							{(infoRow.coachIds || [])
								.map((id) => personName(personById(id)))
								.filter(Boolean)
								.join(", ") || "—"}
						</p>
						<p>
							Schiedsrichter:{" "}
							{(infoRow.refereeIds || [])
								.map((id) => personName(personById(id)))
								.filter(Boolean)
								.join(", ") || "—"}
						</p>
						{infoRow.comment ? (
							<p>Kommentar: {infoRow.comment}</p>
						) : null}
					</div>
				) : null}
			</SlideIn>
			<Modal
				header="Mannschaft melden"
				isOpen={Boolean(submitRow)}
				cancelButtonHandler={() => setSubmitRow(null)}
				confirmButtonText="Mannschaft melden"
				confirmButtonHandler={async () => {
					if (!submitRow) {
						return;
					}
					await patchSignup(
						submitRow.championshipId,
						submitRow.id,
						{ status: "eingereicht" },
						"Meldung eingereicht"
					);
					setSubmitRow(null);
				}}
			>
				<p>
					Hiermit wird die Mannschaft gemeldet. Die angegebenen
					Spieler*innen werden dann vom Staffelleiter geprüft und ggf.
					bestätigt.
				</p>
			</Modal>
			<Modal
				header="Meldung überarbeiten"
				isOpen={Boolean(reeditRow)}
				cancelButtonHandler={() => setReeditRow(null)}
				confirmButtonText="Meldung überarbeiten"
				confirmButtonHandler={async () => {
					if (!reeditRow) {
						return;
					}
					await patchSignup(
						reeditRow.championshipId,
						reeditRow.id,
						{ status: "eingeladen" },
						"Meldungsstatus aktualisiert"
					);
					setReeditRow(null);
				}}
			>
				<p>
					Der Status der Meldung wird hiermit zurückgesetzt. Die
					Meldung muss danach neu eingereicht werden.
				</p>
			</Modal>
			<Modal
				header="Meldung löschen"
				isOpen={Boolean(deleteRow)}
				cancelButtonHandler={() => setDeleteRow(null)}
				confirmButtonText="Meldung löschen"
				confirmButtonHandler={async () => {
					if (!deleteRow) {
						return;
					}
					await deleteSignup(
						deleteRow.championshipId,
						deleteRow.id
					);
					setDeleteRow(null);
				}}
			>
				<p>
					Sind Sie sicher, dass Sie die Meldung für den Wettkampf{" "}
					{deleteRow?.championshipTitle} löschen möchten?
				</p>
			</Modal>
			{loading ? <p>Speichert ...</p> : null}
		</div>
	);
};

export default SignUps;
