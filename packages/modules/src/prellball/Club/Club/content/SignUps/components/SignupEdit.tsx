"use client";

import { FC, useEffect, useState } from "react";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { PersonClass } from "@repo/types";
import {
	DivisionCategory,
	divisionLabel
} from "../../../../../functions/divisions";
import Referees from "./Referees";

const personLabel = (person: PersonClass) =>
	person.name || person.label || person.objectId;

const personElements = (
	people: PersonClass[],
	selected: string[]
): SelectElement[] =>
	people.map((person) => ({
		value: person.objectId,
		id: person.objectId,
		label: personLabel(person),
		selected: selected.includes(person.objectId)
	}));

const SignupEdit: FC<{
	isOpen: boolean;
	title: string;
	division: string;
	divisions: DivisionCategory[];
	people: PersonClass[];
	players: string[];
	coaches: string[];
	referees: string[];
	captain: string;
	refereeClass: unknown;
	onPlayers: (ids: string[]) => void;
	onCoaches: (ids: string[]) => void;
	onReferees: (ids: string[]) => void;
	onCaptain: (id: string) => void;
	onClose: () => void;
	onSave: () => void;
}> = ({
	isOpen,
	title,
	division,
	divisions,
	people,
	players,
	coaches,
	referees,
	captain,
	refereeClass,
	onPlayers,
	onCoaches,
	onReferees,
	onCaptain,
	onClose,
	onSave
}) => {
	const [panel, setPanel] = useState<
		"players" | "coaches" | "referees" | null
	>(null);

	useEffect(() => {
		if (!isOpen) setPanel(null);
	}, [isOpen]);

	useEffect(() => {
		if (captain && !players.includes(captain)) onCaptain("");
	}, [captain, onCaptain, players]);

	const playerElements = personElements(people, players);
	const coachElements = personElements(people, coaches);
	const selectedPlayers = players
		.map((id) => people.find((person) => person.objectId === id))
		.filter((person): person is PersonClass => Boolean(person));
	const selectedCoaches = coaches
		.map((id) => people.find((person) => person.objectId === id))
		.filter((person): person is PersonClass => Boolean(person));
	const secondaryContent =
		panel === "players" ? (
			<div className="flex col a-st gap-sm">
				<ElementSelectInterface
					elements={playerElements}
					selectedElements={playerElements.filter((item) =>
						players.includes(String(item.value))
					)}
					onSelect={(selected) =>
						onPlayers(selected.map((item) => String(item.value)))
					}
					isSearchable
					title="Spieler:innen"
					max={10}
					setSelectedToTop
				/>
			</div>
		) : panel === "coaches" ? (
			<div className="flex col a-st gap-sm">
				<ElementSelectInterface
					elements={coachElements}
					selectedElements={coachElements.filter((item) =>
						coaches.includes(String(item.value))
					)}
					onSelect={(selected) =>
						onCoaches(selected.map((item) => String(item.value)))
					}
					isSearchable
					title="Betreuer"
				/>
			</div>
		) : panel === "referees" ? (
			<Referees
				mode="select"
				selectedIds={referees}
				refereeClass={refereeClass}
				onChange={onReferees}
				onOpen={() => setPanel("referees")}
			/>
		) : null;

	return (
		<SlideIn
			header="Meldung"
			isOpen={isOpen}
			cancel={onClose}
			confirm={onSave}
			confirmText="Speichern"
			size="large"
			secondaryContent={secondaryContent}
			showSecondaryContent={panel !== null}
		>
			<div className="flex col a-st gap-sm">
				<h2 className="small">
					{title} · {divisionLabel(division, divisions)}
				</h2>
				<div className="flex col a-st gap-sm">
					<h3>Spieler:innen</h3>
					<div className="flex col a-st gap-xs">
						{selectedPlayers.map((person) => (
							<button
								key={person.objectId}
								type="button"
								className="flex row a-ce j-sb"
								style={{
									width: "100%",
									background: "transparent",
									border: "none",
									padding: 0,
									cursor: "pointer",
									textAlign: "left"
								}}
								onClick={() => onCaptain(person.objectId)}
							>
								<span>{personLabel(person)}</span>
								{person.objectId === captain ? (
									<span>C</span>
								) : null}
							</button>
						))}
					</div>
					<button
						type="button"
						className="full_button sm secondary"
						onClick={() => setPanel("players")}
					>
						Spieler:innen auswählen
					</button>
				</div>
				<div className="flex col a-st gap-sm">
					<h3>Betreuer</h3>
					<div className="flex col a-st gap-xs">
						{selectedCoaches.map((person) => (
							<span key={person.objectId}>
								{personLabel(person)}
							</span>
						))}
					</div>
					<button
						type="button"
						className="full_button sm secondary"
						onClick={() => setPanel("coaches")}
					>
						Betreuer auswählen
					</button>
				</div>
				<Referees
					selectedIds={referees}
					refereeClass={refereeClass}
					onChange={onReferees}
					onOpen={() => setPanel("referees")}
				/>
			</div>
		</SlideIn>
	);
};

export default SignupEdit;
