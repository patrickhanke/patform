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
import { selectString } from "../../../Competition/CompetitionDetail/functions/selectValue";
import EditTeam from "./EditTeam";

const SignUps: FC<ClubTabProps> = ({ related }) => {
	const { data: club } = usePageData<ClubClass>();
	const {
		rows,
		loading,
		patchSignup,
		createOpenSignup,
		deleteSignup,
		openCompetitions
	} = useClubSignups(club, related.competitions, related.refetchCompetitions);

	const [season, setSeason] = useState("");
	const [createOpen, setCreateOpen] = useState(false);
	const [selectedCompetitionId, setSelectedCompetitionId] = useState("");
	const [selectedClass, setSelectedClass] = useState("");
	const [editRow, setEditRow] = useState<ClubSignupRow | null>(null);
	const [infoRow, setInfoRow] = useState<ClubSignupRow | null>(null);
	const [submitRow, setSubmitRow] = useState<ClubSignupRow | null>(null);
	const [reeditRow, setReeditRow] = useState<ClubSignupRow | null>(null);
	const [deleteRow, setDeleteRow] = useState<ClubSignupRow | null>(null);

	const seasonOptions = useMemo(() => {
		const values = Array.from(
			new Set(
				related.competitions
					.map((item) => item.season)
					.filter((item): item is string => Boolean(item))
			)
		);
		return values.map((value) => ({ value, label: value }));
	}, [related.competitions]);

	const filteredRows = season
		? rows.filter((row) => row.competitionSeason === season)
		: rows;

	const CompetitionOptions = openCompetitions.map((item) => ({
		value: item.objectId,
		label: item.title,
		classes: item.classes || []
	}));
	const selectedCompetition = openCompetitions.find(
		(item) => item.objectId === selectedCompetitionId
	);
	const classOptions = (selectedCompetition?.classes || []).map((item) => ({
		value: item,
		label: item
	}));

	const personById = (id?: string) =>
		related.people.find((person) => person.objectId === id);

	const columns: ColumnDef<ClubSignupRow>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row.competitionTitle,
				header: () => <span>Wettkampf</span>,
				id: "Competition",
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
					row.competitionDeadline
						? new Date(row.competitionDeadline).toLocaleDateString(
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
									!row.competitionFreeSignup && (
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
				{openCompetitions.length > 0 ? (
					<CreateButton
						text={`Offene Meldungen (${openCompetitions.length})`}
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
					if (!selectedCompetitionId || !selectedClass) {
						return;
					}
					await createOpenSignup(selectedCompetitionId, selectedClass);
					setCreateOpen(false);
					setSelectedCompetitionId("");
					setSelectedClass("");
				}}
				confirmText="Hinzufügen"
				disabled={[false, !selectedCompetitionId || !selectedClass]}
			>
				<div className="flex col a-st gap-sm">
					<Select
						id="open-Competition"
						label="Wettkampf"
						options={CompetitionOptions}
						value={
							CompetitionOptions.find(
								(option) =>
									option.value === selectedCompetitionId
							) || null
						}
						onChange={(option) => {
							setSelectedCompetitionId(selectString(option));
							setSelectedClass("");
						}}
					/>
					<Select
						id="open-class"
						label="Spielklasse"
						isDisabled={!selectedCompetitionId}
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
						? `${editRow.competitionTitle} — Mannschaft-Nr: ${editRow.number}`
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
								editRow.competitionId,
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
						<h3>{infoRow.competitionTitle}</h3>
						<p>Saison: {infoRow.competitionSeason || "—"}</p>
						<p>Spielklasse: {infoRow.class || "—"}</p>
						<p>
							Meldefrist:{" "}
							{infoRow.competitionDeadline
								? new Date(
										infoRow.competitionDeadline
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
						submitRow.competitionId,
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
						reeditRow.competitionId,
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
						deleteRow.competitionId,
						deleteRow.id
					);
					setDeleteRow(null);
				}}
			>
				<p>
					Sind Sie sicher, dass Sie die Meldung für den Wettkampf{" "}
					{deleteRow?.competitionTitle} löschen möchten?
				</p>
			</Modal>
			{loading ? <p>Speichert ...</p> : null}
		</div>
	);
};

export default SignUps;
