"use client";

import { FC, useEffect, useState } from "react";
import {
	ElementSelectInterface,
	SelectElement,
	SlideIn,
	StatelessToggle
} from "@repo/ui";
import { ChampionshipGame, ChampionshipSignUp, PersonClass } from "@repo/types";
import { PrellballPersonData } from "@repo/types";
import {
	mergedPersonData,
	playerPlayedGame,
	refereePersonId,
	withPlayedGame,
	withRefereeGame
} from "../../../../Championship/functions/person";

type TeamSlot = "team1" | "team2";

type PersonDrafts = Record<string, PrellballPersonData>;

const numberOrNull = (value: string) => {
	if (value.trim() === "") return null;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? null : parsed;
};

const ScorePair: FC<{
	label: string;
	left?: number | null;
	right?: number | null;
	onLeft: (value: number | null) => void;
	onRight: (value: number | null) => void;
}> = ({ label, left, right, onLeft, onRight }) => (
	<div className="flex col a-ce gap-sm">
		<h3>{label}</h3>
		<div className="flex row a-ce gap-sm">
			<input
				type="number"
				value={left ?? ""}
				style={{ width: 80 }}
				onChange={(event) => onLeft(numberOrNull(event.target.value))}
			/>
			<span>:</span>
			<input
				type="number"
				value={right ?? ""}
				style={{ width: 80 }}
				onChange={(event) => onRight(numberOrNull(event.target.value))}
			/>
		</div>
	</div>
);

const ResultSlideIn: FC<{
	game: ChampionshipGame | null;
	leftLabel: string;
	rightLabel: string;
	leftSignup?: ChampionshipSignUp;
	rightSignup?: ChampionshipSignUp;
	people: PersonClass[];
	season: string;
	onClose: () => void;
	onSave: (
		game: ChampionshipGame,
		personDrafts: PersonDrafts
	) => Promise<void>;
}> = ({
	game,
	leftLabel,
	rightLabel,
	leftSignup,
	rightSignup,
	people,
	season,
	onClose,
	onSave
}) => {
	const [draft, setDraft] = useState<ChampionshipGame | null>(game);
	const [personDrafts, setPersonDrafts] = useState<PersonDrafts>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setDraft(game);
		setPersonDrafts({});
	}, [game]);

	const setPerson = (personId: string, data: PrellballPersonData) =>
		setPersonDrafts((previous) => ({ ...previous, [personId]: data }));

	const elements: SelectElement[] = people.map((person) => ({
		value: person.objectId,
		id: person.objectId,
		label: person.name || person.label || person.objectId
	}));
	const currentRefereeId = draft
		? (draft.referee ?? refereePersonId(people, personDrafts, draft.id))
		: "";
	const selected = elements.find(
		(element) => element.value === currentRefereeId
	);

	const players = (slot: TeamSlot, signup?: ChampionshipSignUp) => {
		if (!signup?.club_id) return [];
		const stored = draft?.[`${slot}_players`];
		return signup.person_ids.map((personId) => {
			const person = people.find((item) => item.objectId === personId);
			return {
				personId,
				name: person?.name || person?.label || personId,
				played: stored
					? stored.includes(personId)
					: playerPlayedGame(
							mergedPersonData(person, personDrafts),
							season,
							signup.club_id || "",
							draft?.id || ""
						)
			};
		});
	};

	const togglePlayer = (
		slot: TeamSlot,
		signup: ChampionshipSignUp | undefined,
		personId: string,
		played: boolean
	) => {
		if (!draft) return;
		const current = players(slot, signup)
			.filter((player) => player.played)
			.map((player) => player.personId)
			.filter((id) => id !== personId);
		setDraft({
			...draft,
			[`${slot}_players`]: played ? [...current, personId] : current
		});
		const person = people.find((item) => item.objectId === personId);
		setPerson(
			personId,
			withPlayedGame(
				mergedPersonData(person, personDrafts),
				season,
				signup?.club_id || "",
				draft.id,
				played
			)
		);
	};

	const selectReferee = (next: SelectElement[]) => {
		if (!draft) return;
		const personId = String(next[0]?.value || "");
		setDraft({ ...draft, referee: personId || undefined });
		if (currentRefereeId && currentRefereeId !== personId) {
			const previous = people.find(
				(item) => item.objectId === currentRefereeId
			);
			setPerson(
				currentRefereeId,
				withRefereeGame(
					mergedPersonData(previous, personDrafts),
					draft.id,
					false
				)
			);
		}
		if (personId) {
			const person = people.find((item) => item.objectId === personId);
			setPerson(
				personId,
				withRefereeGame(
					mergedPersonData(person, personDrafts),
					draft.id,
					true
				)
			);
		}
	};

	const save = async () => {
		if (!draft) return;
		setSaving(true);
		try {
			await onSave(draft, personDrafts);
			onClose();
		} finally {
			setSaving(false);
		}
	};

	const playerList = (slot: TeamSlot, signup?: ChampionshipSignUp) =>
		players(slot, signup).map((player) => (
			<div key={player.personId} className="flex row a-ce gap-sm">
				<StatelessToggle
					value={player.played}
					onChange={(value) =>
						togglePlayer(slot, signup, player.personId, value)
					}
				/>
				<span>{player.name}</span>
			</div>
		));

	return (
		<SlideIn
			header="Ergebnisse und Einsätze"
			isOpen={Boolean(game)}
			cancel={onClose}
			confirm={save}
			confirmText="Speichern"
			cancelText="Abbrechen"
			loading={saving}
			size="large"
		>
			{draft ? (
				<div className="flex col a-st gap-md">
					<div className="flex col a-ce gap-sm">
						<div className="flex row a-ce gap-sm">
							<h3>{leftLabel}</h3>
							<span>:</span>
							<h3>{rightLabel}</h3>
						</div>
						<ScorePair
							label="Halbzeit"
							left={draft.half1}
							right={draft.half2}
							onLeft={(value) =>
								setDraft({ ...draft, half1: value })
							}
							onRight={(value) =>
								setDraft({ ...draft, half2: value })
							}
						/>
						<ScorePair
							label="Ergebnis"
							left={draft.score1}
							right={draft.score2}
							onLeft={(value) =>
								setDraft({ ...draft, score1: value })
							}
							onRight={(value) =>
								setDraft({ ...draft, score2: value })
							}
						/>
					</div>
					<div className="flex col a-st gap-sm">
						<h3>Schiedsrichter</h3>
						<ElementSelectInterface
							elements={elements}
							selectedElements={selected ? [selected] : []}
							onSelect={selectReferee}
							max={1}
							isSearchable
							isClearable
							title="Schiedsrichter"
						/>
					</div>
					<h3>Einsätze</h3>
					<div className="flex row a-st j-sb gap-md">
						<div className="flex col a-st gap-sm">
							<h3>{leftLabel}</h3>
							{playerList("team1", leftSignup)}
						</div>
						<div className="flex col a-st gap-sm">
							<h3>{rightLabel}</h3>
							{playerList("team2", rightSignup)}
						</div>
					</div>
				</div>
			) : null}
		</SlideIn>
	);
};

export default ResultSlideIn;
