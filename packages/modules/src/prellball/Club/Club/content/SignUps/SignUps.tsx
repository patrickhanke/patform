"use client";

import { FC, useMemo, useState } from "react";
import {
	ColumnDef,
	CreateButton,
	ElementSelectInterface,
	IconButton,
	Modal,
	Select,
	SelectElement,
	SlideIn,
	Table
} from "@repo/ui";
import {
	ChampionshipClass,
	ChampionshipSignUp,
	PersonClass
} from "@repo/types";
import { useAppContext, useDataHandlerSecure } from "@repo/provider";
import {
	divisionLabel,
	selectedDivisionIds
} from "../../../../functions/divisions";
import useDivisionCategories from "../../../../hooks/useDivisionCategories";
import { signupStatusLabel } from "../../../../Championship/constants/signupStatus";
import {
	clubNumber,
	createSignup
} from "../../../../Championship/functions/signups";
import { toDateInput } from "../../../../Championship/functions/dates";
import { selectString } from "../../../../Championship/functions/selectValue";

type SignupRow = {
	id: string;
	championshipId: string;
	title: string;
	division: string;
	number: number;
	status: string;
	deadline?: string;
	open: boolean;
	signup?: ChampionshipSignUp;
};

const SignUps: FC<{
	clubId: string;
	seasonId: string;
	seasons: { objectId: string; title: string }[];
	onSeason: (id: string) => void;
	championships: ChampionshipClass[];
	people: PersonClass[];
	refetchChampionships: () => Promise<unknown>;
}> = ({
	clubId,
	seasonId,
	seasons,
	onSeason,
	championships,
	people,
	refetchChampionships
}) => {
	const { project } = useAppContext();
	const divisions = useDivisionCategories(project?.objectId);
	const { updateData } = useDataHandlerSecure();
	const [edit, setEdit] = useState<SignupRow | null>(null);
	const [players, setPlayers] = useState<string[]>([]);
	const [coaches, setCoaches] = useState<string[]>([]);
	const [referees, setReferees] = useState<string[]>([]);
	const [captain, setCaptain] = useState("");
	const [division, setDivision] = useState("");
	const [confirmSubmit, setConfirmSubmit] = useState(false);
	const [createOpen, setCreateOpen] = useState(false);
	const [createChampionshipId, setCreateChampionshipId] = useState("");
	const [createDivision, setCreateDivision] = useState("");

	const inSeason = championships.filter((item) =>
		seasonId ? (item.categories || []).includes(seasonId) : false
	);
	const clubPeople = people.filter((person) =>
		(person.categories || []).includes(clubId)
	);
	const openChampionships = inSeason.filter(
		(item) => item.settings?.open_signup
	);
	const createChampionship = openChampionships.find(
		(item) => item.objectId === createChampionshipId
	);
	const availableDivisionsFor = (championship?: ChampionshipClass) => {
		if (!championship) return [];
		const allowSecondary = championship.settings?.secondary_teams;
		const taken = new Set(
			(championship.data?.sign_ups || [])
				.filter((signup) => signup.club_id === clubId)
				.map((signup) => signup.division)
		);
		return selectedDivisionIds(championship.categories, divisions).filter(
			(value) => allowSecondary || !taken.has(value)
		);
	};
	const createDivisionOptions = availableDivisionsFor(createChampionship).map(
		(value) => ({
			value,
			label: divisionLabel(value, divisions) || value
		})
	);
	const championshipOptions = openChampionships.map((item) => ({
		value: item.objectId,
		label: item.title
	}));

	const closeCreate = () => {
		setCreateOpen(false);
		setCreateChampionshipId("");
		setCreateDivision("");
	};

	const rows: SignupRow[] = useMemo(() => {
		const next: SignupRow[] = [];
		inSeason.forEach((championship) => {
			const signups = championship.data?.sign_ups || [];
			signups.forEach((signup) => {
				const mine = signup.club_id === clubId;
				const open = !signup.club_id;
				if (!mine && !open) return;
				next.push({
					id: `${championship.objectId}:${signup.id}`,
					championshipId: championship.objectId,
					title: championship.title,
					division: signup.division,
					number: signup.number,
					status: open ? "offen" : signup.status,
					deadline: championship.settings?.deadline,
					open,
					signup
				});
			});
			if (!championship.settings?.open_signup) return;
			const taken = new Set(
				signups
					.filter((signup) => signup.club_id === clubId)
					.map((signup) => signup.division)
			);
			selectedDivisionIds(championship.categories, divisions).forEach(
				(value) => {
					if (taken.has(value)) return;
					if (
						signups.some(
							(signup) =>
								!signup.club_id && signup.division === value
						)
					) {
						return;
					}
					next.push({
						id: `${championship.objectId}:open:${value}`,
						championshipId: championship.objectId,
						title: championship.title,
						division: value,
						number: 0,
						status: "offen",
						deadline: championship.settings?.deadline,
						open: true
					});
				}
			);
		});
		return next;
	}, [clubId, divisions, inSeason]);

	const saveChampionship = async (
		championship: ChampionshipClass,
		signups: ChampionshipSignUp[],
		message: string
	) => {
		await updateData({
			className: "Championship",
			objectId: championship.objectId,
			updateObject: { data: { ...championship.data, sign_ups: signups } },
			feedback: message
		});
		await refetchChampionships();
	};

	const openEdit = (row: SignupRow) => {
		setEdit(row);
		setPlayers(row.signup?.person_ids || []);
		setCoaches(row.signup?.coach_ids || []);
		setReferees(row.signup?.referee_ids || []);
		setCaptain(row.signup?.captain_id || "");
		setDivision(row.division);
	};

	const createOpenSignup = async () => {
		if (!createChampionship?.settings?.open_signup || !createDivision) {
			return;
		}
		const signups = [...(createChampionship.data?.sign_ups || [])];
		const allowSecondary = createChampionship.settings?.secondary_teams;
		const alreadyHas = signups.some(
			(signup) =>
				signup.club_id === clubId && signup.division === createDivision
		);
		if (alreadyHas && !allowSecondary) return;
		const nextSignup: ChampionshipSignUp = {
			...createSignup(createDivision, signups.length + 1),
			club_id: clubId,
			status: "eingeladen",
			number: allowSecondary
				? clubNumber(signups, clubId, createDivision, "")
				: 1
		};
		await saveChampionship(
			createChampionship,
			[...signups, nextSignup],
			"Meldung erstellt"
		);
		closeCreate();
		openEdit({
			id: `${createChampionship.objectId}:${nextSignup.id}`,
			championshipId: createChampionship.objectId,
			title: createChampionship.title,
			division: nextSignup.division,
			number: nextSignup.number,
			status: nextSignup.status,
			deadline: createChampionship.settings?.deadline,
			open: false,
			signup: nextSignup
		});
	};

	const claim = async (row: SignupRow) => {
		const championship = inSeason.find(
			(item) => item.objectId === row.championshipId
		);
		if (!championship) return;
		const signups = [...(championship.data?.sign_ups || [])];
		if (row.signup) {
			const index = signups.findIndex(
				(item) => item.id === row.signup?.id
			);
			const current = signups[index];
			if (!current) return;
			signups[index] = {
				...current,
				club_id: clubId,
				status: "eingeladen"
			};
		} else {
			signups.push({
				...createSignup(row.division, signups.length + 1),
				club_id: clubId,
				status: "eingeladen",
				number: 1
			});
		}
		await saveChampionship(championship, signups, "Meldung übernommen");
	};

	const saveEdit = async () => {
		if (!edit) return;
		const championship = inSeason.find(
			(item) => item.objectId === edit.championshipId
		);
		if (!championship) return;
		const signups = [...(championship.data?.sign_ups || [])];
		const nextSignup: ChampionshipSignUp = {
			...(edit.signup ||
				createSignup(division || edit.division, signups.length + 1)),
			division: division || edit.division,
			club_id: clubId,
			status: edit.open
				? "eingeladen"
				: edit.signup?.status || "eingeladen",
			person_ids: players,
			coach_ids: coaches,
			referee_ids: referees,
			captain_id: captain
		};
		if (edit.signup) {
			const index = signups.findIndex(
				(item) => item.id === edit.signup?.id
			);
			if (index !== -1) signups[index] = nextSignup;
		} else {
			signups.push(nextSignup);
		}
		await saveChampionship(championship, signups, "Meldung gespeichert");
		setEdit(null);
	};

	const submit = async () => {
		if (!edit?.signup) return;
		const championship = inSeason.find(
			(item) => item.objectId === edit.championshipId
		);
		if (!championship) return;
		const signups = (championship.data?.sign_ups || []).map((signup) =>
			signup.id === edit.signup?.id
				? {
						...signup,
						person_ids: players,
						coach_ids: coaches,
						referee_ids: referees,
						captain_id: captain,
						status: "eingereicht" as const
					}
				: signup
		);
		await saveChampionship(championship, signups, "Mannschaft gemeldet");
		setConfirmSubmit(false);
		setEdit(null);
	};

	const personElements = (selected: string[]): SelectElement[] =>
		clubPeople.map((person) => ({
			value: person.objectId,
			id: person.objectId,
			label: person.name || person.label || person.objectId,
			selected: selected.includes(person.objectId)
		}));

	const columns: ColumnDef<SignupRow>[] = [
		{
			id: "title",
			header: () => <span>Wettkampf</span>,
			accessorFn: (row) => row.title,
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			id: "class",
			header: () => <span>Division</span>,
			accessorFn: (row) => divisionLabel(row.division, divisions),
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			id: "number",
			header: () => <span>MS-Nr</span>,
			accessorFn: (row) => (row.open ? "—" : row.number),
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			id: "deadline",
			header: () => <span>Meldefrist</span>,
			accessorFn: (row) => toDateInput(row.deadline) || "—",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			id: "status",
			header: () => <span>Status</span>,
			accessorFn: (row) =>
				row.status === "offen"
					? "offen"
					: signupStatusLabel[
							row.status as keyof typeof signupStatusLabel
						] || row.status,
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			id: "action",
			header: () => <span>Melden</span>,
			accessorFn: (row) => row.id,
			cell: (info) => {
				const row = info.row.original;
				if (row.open) {
					return (
						<button
							type="button"
							className="full_button sm"
							onClick={() => claim(row)}
						>
							Übernehmen
						</button>
					);
				}
				const ready =
					(row.signup?.person_ids.length || 0) >= 3 &&
					Boolean(row.signup?.captain_id);
				if (row.status === "eingereicht" || row.status === "gemeldet") {
					return <span>{row.status}</span>;
				}
				return (
					<button
						type="button"
						className="full_button sm"
						disabled={!ready}
						onClick={() => {
							openEdit(row);
							setConfirmSubmit(true);
						}}
					>
						Diese Mannschaft melden
					</button>
				);
			},
			footer: (info) => info.column.id
		},
		{
			id: "edit",
			header: () => <span>Bearbeiten</span>,
			accessorFn: (row) => row.id,
			cell: (info) => (
				<IconButton
					icon="edit"
					onClick={() => openEdit(info.row.original)}
				/>
			),
			footer: (info) => info.column.id
		}
	];

	return (
		<div className="flex col a-st gap-sm">
			<div
				className="flex row a-ce j-sb gap-sm"
				style={{ flexWrap: "wrap" }}
			>
				<Select
					id="signup-season"
					label="Saison"
					options={seasons.map((season) => ({
						value: season.objectId,
						label: season.title
					}))}
					value={
						seasons
							.map((season) => ({
								value: season.objectId,
								label: season.title
							}))
							.find((option) => option.value === seasonId) || null
					}
					onChange={(option) => onSeason(selectString(option))}
				/>
				{seasonId && openChampionships.length > 0 ? (
					<CreateButton
						text={`Offene Meldung (${openChampionships.length})`}
						size="small"
						onClick={() => setCreateOpen(true)}
					/>
				) : null}
			</div>
			{!seasonId ? (
				<p>
					Wähle eine Saison. Saisons sind Kategorien mit dem Schlüssel
					season.
				</p>
			) : (
				<Table
					columns={columns}
					data={rows}
					rowIdResolver={(row) => (row as SignupRow).id}
				/>
			)}
			<SlideIn
				header="Offene Meldung hinzufügen"
				isOpen={createOpen}
				cancel={closeCreate}
				confirm={() => createOpenSignup()}
				confirmText="Hinzufügen"
				disabled={[false, !createChampionshipId || !createDivision]}
			>
				<div className="flex col a-st gap-sm">
					<Select
						id="open-signup-championship"
						label="Wettkampf"
						options={championshipOptions}
						value={
							championshipOptions.find(
								(option) =>
									option.value === createChampionshipId
							) || null
						}
						onChange={(option) => {
							const id = selectString(option);
							setCreateChampionshipId(id);
							const championship = openChampionships.find(
								(item) => item.objectId === id
							);
							const available =
								availableDivisionsFor(championship);
							setCreateDivision(
								available.length === 1 ? available[0]! : ""
							);
						}}
					/>
					<Select
						id="open-signup-division"
						label="Division"
						isDisabled={!createChampionshipId}
						options={createDivisionOptions}
						value={
							createDivisionOptions.find(
								(option) => option.value === createDivision
							) || null
						}
						onChange={(option) =>
							setCreateDivision(selectString(option))
						}
					/>
					{createChampionship &&
					createDivisionOptions.length === 0 ? (
						<p>
							Für diesen Wettkampf gibt es keine freie Division.
							Zweitmannschaften sind nicht erlaubt.
						</p>
					) : null}
				</div>
			</SlideIn>
			<SlideIn
				header="Meldung"
				isOpen={Boolean(edit) && !confirmSubmit}
				cancel={() => setEdit(null)}
				confirm={() => saveEdit()}
				confirmText="Speichern"
				size="large"
			>
				{edit ? (
					<div className="flex col a-st gap-sm">
						<p>
							{edit.title} ·{" "}
							{divisionLabel(edit.division, divisions)}
						</p>
						<Select
							id="signup-captain"
							label="Spielführer:in"
							options={clubPeople
								.filter((person) =>
									players.includes(person.objectId)
								)
								.map((person) => ({
									value: person.objectId,
									label: person.name || person.label
								}))}
							value={
								clubPeople
									.filter((person) =>
										players.includes(person.objectId)
									)
									.map((person) => ({
										value: person.objectId,
										label: person.name || person.label
									}))
									.find(
										(option) => option.value === captain
									) || null
							}
							onChange={(option) =>
								setCaptain(selectString(option))
							}
						/>
						<h3>Spieler:innen</h3>
						<ElementSelectInterface
							elements={personElements(players)}
							selectedElements={personElements(players).filter(
								(item) => players.includes(String(item.value))
							)}
							onSelect={(selected) =>
								setPlayers(
									selected.map((item) => String(item.value))
								)
							}
							isSearchable
							title="Spieler:innen"
							max={10}
							setSelectedToTop
						/>
						<h3>Betreuer</h3>
						<ElementSelectInterface
							elements={personElements(coaches)}
							selectedElements={personElements(coaches).filter(
								(item) => coaches.includes(String(item.value))
							)}
							onSelect={(selected) =>
								setCoaches(
									selected.map((item) => String(item.value))
								)
							}
							isSearchable
						/>
						<h3>Schiedsrichter</h3>
						<ElementSelectInterface
							elements={personElements(referees)}
							selectedElements={personElements(referees).filter(
								(item) => referees.includes(String(item.value))
							)}
							onSelect={(selected) =>
								setReferees(
									selected.map((item) => String(item.value))
								)
							}
							isSearchable
						/>
					</div>
				) : null}
			</SlideIn>
			<Modal
				isOpen={confirmSubmit}
				header="Mannschaft melden"
				cancelButtonHandler={() => setConfirmSubmit(false)}
				confirmButtonHandler={() => submit()}
				confirmButtonText="Mannschaft melden"
				buttonDisabled={[false, players.length < 3 || !captain]}
			>
				<p>
					Die Mannschaft wird gemeldet. Sie braucht mindestens drei
					Spieler:innen und eine Spielführer:in.
				</p>
			</Modal>
		</div>
	);
};

export default SignUps;
