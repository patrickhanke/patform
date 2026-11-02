"use client";

import { FC } from "react";
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
		? refereePersonId(people, drafts, game.id)
		: "";
	const selected = elements.find(
		(element) => element.value === currentRefereeId
	);

	const togglePlayer = (
		personId: string,
		clubId: string,
		played: boolean
	) => {
		const person = people.find((item) => item.objectId === personId);
		onPerson(
			personId,
			withPlayedGame(
				mergedPersonData(person, drafts),
				season,
				clubId,
				game?.id || "",
				played
			)
		);
	};

	const selectReferee = (next: SelectElement[]) => {
		if (!game) return;
		const personId = String(next[0]?.value || "");
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

	const players = (signup?: ChampionshipSignUp) => {
		if (!signup?.club_id) return [];
		return signup.person_ids.map((personId) => {
			const person = people.find((item) => item.objectId === personId);
			const data = mergedPersonData(person, drafts);
			return {
				personId,
				name: person?.name || person?.label || personId,
				played: playerPlayedGame(
					data,
					season,
					signup.club_id || "",
					game?.id || ""
				)
			};
		});
	};

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
							{players(leftSignup).map((player) => (
								<div
									key={player.personId}
									className="flex row a-ce gap-sm"
								>
									<StatelessToggle
										value={player.played}
										onChange={(value) =>
											togglePlayer(
												player.personId,
												leftSignup?.club_id || "",
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
							{players(rightSignup).map((player) => (
								<div
									key={player.personId}
									className="flex row a-ce gap-sm"
								>
									<StatelessToggle
										value={player.played}
										onChange={(value) =>
											togglePlayer(
												player.personId,
												rightSignup?.club_id || "",
												value
											)
										}
									/>
									<span>{player.name}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
		</SlideIn>
	);
};

export default ResultSlideIn;
