"use client";

import { FC, useMemo, useState } from "react";
import {
	ElementSelectInterface,
	IconButton,
	Modal,
	SelectElement
} from "@repo/ui";
import { PersonClass, PrellballClubClass } from "@repo/types";
import { useDataHandlerSecure } from "@repo/provider";
import { unionsOfClub } from "../../functions/club";

const personName = (person: PersonClass) =>
	person.name || person.label || person.objectId;

const UnionAssignment: FC<{
	union: PrellballClubClass;
	clubId: string;
	clubs: PrellballClubClass[];
	people: PersonClass[];
	refetchPeople: () => Promise<unknown>;
}> = ({ union, clubId, clubs, people, refetchPeople }) => {
	const { updateData } = useDataHandlerSecure();
	const assignedPeople = useMemo(
		() =>
			people
				.filter((person) =>
					(person.categories || []).includes(union.objectId)
				)
				.sort((a, b) => personName(a).localeCompare(personName(b))),
		[people, union.objectId]
	);
	const assigned = assignedPeople.map((person) => person.objectId);
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);

	const isPrimary = union.settings?.primary_club_id === clubId;
	const partnerId = isPrimary
		? union.settings?.secondary_club_id
		: union.settings?.primary_club_id;
	const partner = clubs.find((item) => item.objectId === partnerId);

	const elements: SelectElement[] = [...people]
		.sort((a, b) => personName(a).localeCompare(personName(b)))
		.map((person) => ({
			value: person.objectId,
			id: person.objectId,
			label: personName(person)
		}));
	const changed =
		pending.length !== assigned.length ||
		pending.some((id) => !assigned.includes(id));

	const openModal = () => {
		setPending(assigned);
		setOpen(true);
	};

	const save = async () => {
		const touched = people.filter(
			(person) =>
				pending.includes(person.objectId) !==
				assigned.includes(person.objectId)
		);
		if (touched.length === 0) {
			setOpen(false);
			return;
		}
		setSaving(true);
		try {
			for (let index = 0; index < touched.length; index += 1) {
				const person = touched[index]!;
				const categories = (person.categories || []).filter(
					(id) => id !== union.objectId
				);
				if (pending.includes(person.objectId)) {
					categories.push(union.objectId);
				}
				await updateData({
					className: "Person",
					objectId: person.objectId,
					updateObject: { categories },
					feedback:
						index === touched.length - 1
							? "Spieler:innen gespeichert"
							: undefined
				});
			}
			await refetchPeople();
			setOpen(false);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="content_element flex col a-st gap-sm">
			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col gap-xs">
					<h2>{union.title}</h2>
					<p>
						{isPrimary ? "Hauptverein" : "Nebenverein"}
						{partner
							? ` · ${isPrimary ? "Nebenverein" : "Hauptverein"}: ${partner.title}`
							: ""}
					</p>
				</div>
				{isPrimary ? (
					<IconButton
						isLink
						link={`/vereine/${union.objectId}`}
						icon="edit"
						text="Spielgemeinschaft bearbeiten"
					/>
				) : null}
			</div>
			<div className="flex row a-ce j-sb gap-sm">
				<h3>Spieler:innen der Spielgemeinschaft</h3>
				<button
					type="button"
					className="full_button sm light"
					onClick={openModal}
				>
					Spieler:innen auswählen
				</button>
			</div>
			{assignedPeople.length === 0 ? (
				<p>Es wurden noch keine Spieler:innen zugewiesen.</p>
			) : (
				<div className="flex col gap-xs">
					{assignedPeople.map((person) => (
						<p key={person.objectId}>{personName(person)}</p>
					))}
				</div>
			)}
			<Modal
				isOpen={open}
				header={`Spieler:innen für ${union.title}`}
				cancelButtonHandler={() => setOpen(false)}
				confirmButtonHandler={() => save()}
				confirmButtonText="Speichern"
				buttonDisabled={[saving, !changed || saving]}
				loading={saving}
			>
				<ElementSelectInterface
					elements={elements}
					selectedElements={elements.filter((item) =>
						pending.includes(String(item.value))
					)}
					onSelect={(next) =>
						setPending(next.map((item) => String(item.value)))
					}
					max={elements.length + 1}
					isSearchable
					setSelectedToTop
				/>
			</Modal>
		</div>
	);
};

const Unions: FC<{
	clubId: string;
	clubs: PrellballClubClass[];
	people: PersonClass[];
	refetchPeople: () => Promise<unknown>;
}> = ({ clubId, clubs, people, refetchPeople }) => {
	const unions = unionsOfClub(clubs, clubId);

	if (unions.length === 0) {
		return <p>Der Verein ist nicht Teil von Spielgemeinschaften.</p>;
	}

	return (
		<div className="flex col a-st gap-md">
			{unions.map((union) => (
				<UnionAssignment
					key={union.objectId}
					union={union}
					clubId={clubId}
					clubs={clubs}
					people={people}
					refetchPeople={refetchPeople}
				/>
			))}
		</div>
	);
};

export default Unions;
