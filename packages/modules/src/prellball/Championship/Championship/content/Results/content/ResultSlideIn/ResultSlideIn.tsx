"use client";

import { FC, useEffect, useState } from "react";
import {
	ElementSelectInterface,
	Modal,
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
} from "@repo/provider";

type TeamSlot = "team1" | "team2";

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
				style={{ minWidth: 80, width: 80 }}
				onChange={(event) => onLeft(numberOrNull(event.target.value))}
			/>
			<span>:</span>
			<input
				type="number"
				value={right ?? ""}
				style={{ minWidth: 80, width: 80 }}
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
	drafts: Record<string, PrellballPersonData>;
	season: string;
	onClose: () => void;
	onGame: (game: ChampionshipGame) => void;
	onPerson: (personId: string, data: PrellballPersonData) => void;
}> = ({
	game,
	leftLabel,
	rightLabel,
	leftSignup,
	rightSignup,
	people,
	drafts,
	season,
	onClose,
	onGame,
	onPerson
}) => {
	const elements: SelectElement[] = people.map((person) => ({
		value: person.objectId,
		id: person.objectId,
		label: person.name || person.label || person.objectId
	}));
	const currentRefereeId = game
		? (game.referee ?? refereePersonId(people, drafts, game.id))
		: "";
	const selected = elements.find(
		(element) => element.value === currentRefereeId
	);
	const [refereeModal, setRefereeModal] = useState(false);

	const players = (slot: TeamSlot, signup?: ChampionshipSignUp) => {
		if (!signup?.club_id) return [];
		const stored = game?.[`${slot}_players`];
		return signup.person_ids.map((personId) => {
			const person = people.find((item) => item.objectId === personId);
			return {
				personId,
				name: person?.name || person?.label || personId,
				played: stored
					? stored.includes(personId)
					: playerPlayedGame(
							mergedPersonData(person, drafts),
							season,
							signup.club_id || "",
							game?.id || ""
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
		if (!game) return;
		const current = players(slot, signup)
			.filter((player) => player.played)
			.map((player) => player.personId);
		onGame({
			...game,
			[`${slot}_players`]: played
				? [...current.filter((id) => id !== personId), personId]
				: current.filter((id) => id !== personId)
		});
		const person = people.find((item) => item.objectId === personId);
		onPerson(
			personId,
			withPlayedGame(
				mergedPersonData(person, drafts),
				season,
				signup?.club_id || "",
				game.id,
				played
			)
		);
	};

	const selectReferee = (next: SelectElement[]) => {
		if (!game) return;
		const personId = String(next[0]?.value || "");
		onGame({ ...game, referee: personId || undefined });
		if (currentRefereeId && currentRefereeId !== personId) {
			const previous = people.find(
				(item) => item.objectId === currentRefereeId
			);
			onPerson(
				currentRefereeId,
				withRefereeGame(
					mergedPersonData(previous, drafts),
					game.id,
					false
				)
			);
		}
		if (personId) {
			const person = people.find((item) => item.objectId === personId);
			onPerson(
				personId,
				withRefereeGame(mergedPersonData(person, drafts), game.id, true)
			);
		}
	};

	useEffect(() => {
		setRefereeModal(false);
		players("team1", leftSignup).forEach((player) => {
			console.log(player);
			if (player.played) return;
			togglePlayer("team1", leftSignup, player.personId, true);
		});
		players("team2", rightSignup).forEach((player) => {
			console.log(player);
			if (player.played) return;
			togglePlayer("team1", leftSignup, player.personId, true);
		});
	}, []);

	return (
		<SlideIn
			header="Ergebnisse und Einsätze"
			isOpen={Boolean(game)}
			cancel={onClose}
			showConfirmButton={false}
			cancelText="Schließen"
			size="large"
		>
			{game ? (
				<div className="flex col a-st gap-md">
					<div className="flex col a-ce gap-sm">
						<div className="flex row a-ce gap-sm">
							<h3>{leftLabel}</h3>
							<span>:</span>
							<h3>{rightLabel}</h3>
						</div>
						<ScorePair
							label="Halbzeit"
							left={game.half1}
							right={game.half2}
							onLeft={(value) =>
								onGame({ ...game, half1: value })
							}
							onRight={(value) =>
								onGame({ ...game, half2: value })
							}
						/>
						<ScorePair
							label="Ergebnis"
							left={game.score1}
							right={game.score2}
							onLeft={(value) =>
								onGame({ ...game, score1: value })
							}
							onRight={(value) =>
								onGame({ ...game, score2: value })
							}
						/>
					</div>

					<h3>Einsätze</h3>
					<div className="flex row a-st j-sb gap-md">
						<div className="flex col a-st gap-sm">
							<h3>{leftLabel}</h3>
							{players("team1", leftSignup).map((player) => (
								<div
									key={player.personId}
									className="flex row a-ce gap-sm"
								>
									<StatelessToggle
										value={player.played}
										onChange={(value) =>
											togglePlayer(
												"team1",
												leftSignup,
												player.personId,
												value
											)
										}
									/>
									<span>{player.name}</span>
								</div>
							))}
						</div>
						<div className="flex col a-st gap-sm">
							<h3>{rightLabel}</h3>
							{players("team2", rightSignup).map((player) => (
								<div
									key={player.personId}
									className="flex row a-ce gap-sm"
								>
									<StatelessToggle
										value={player.played}
										onChange={(value) =>
											togglePlayer(
												"team2",
												rightSignup,
												player.personId,
												value
											)
										}
									/>
									<span>{player.name}</span>
								</div>
							))}
						</div>
					</div>
					<div className="flex col a-st gap-sm">
						<h3>Schiedsrichter</h3>
						<span>
							{selected?.label ||
								"Kein Schiedsrichter ausgewählt"}
						</span>
						<button
							className="full_button md dark"
							onClick={() => setRefereeModal(true)}
						>
							Schiedsrichter auswählen
						</button>
						<Modal
							isOpen={refereeModal}
							cancelButtonHandler={() => setRefereeModal(false)}
							header="Schiedsrichter"
						>
							<ElementSelectInterface
								elements={elements}
								selectedElements={selected ? [selected] : []}
								onSelect={selectReferee}
								max={1}
								isSearchable
								isClearable
								title="Schiedsrichter"
							/>
						</Modal>
					</div>
				</div>
			) : null}
		</SlideIn>
	);
};

export default ResultSlideIn;
