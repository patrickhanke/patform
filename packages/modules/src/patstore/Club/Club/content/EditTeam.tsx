"use client";

import { FC, useState } from "react";
import { CompetitionSignup, PersonClass } from "@repo/types";
import { CreateButton, Divider, Select, TextInput } from "@repo/ui";
import { personOptions } from "../functions/personName";
import { isFemaleClass, isSignupLocked } from "../functions/signupStatus";
import { selectString } from "../../../Competition/CompetitionDetail/functions/selectValue";

type EditTeamProps = {
	signup: CompetitionSignup;
	people: PersonClass[];
	clubPlayerIds: string[];
	onSave: (patch: Partial<CompetitionSignup>) => Promise<void>;
	onClose: () => void;
};

const EditTeam: FC<EditTeamProps> = ({
	signup,
	people,
	clubPlayerIds,
	onSave,
	onClose
}) => {
	const [personIds, setPersonIds] = useState(signup.personIds || []);
	const [coachIds, setCoachIds] = useState(signup.coachIds || []);
	const [refereeIds, setRefereeIds] = useState(signup.refereeIds || []);
	const [captainId, setCaptainId] = useState(signup.captainId || "");
	const [comment, setComment] = useState(signup.comment || "");
	const [saving, setSaving] = useState(false);

	const clubPeople = people.filter((person) =>
		clubPlayerIds.includes(person.objectId)
	);
	const playerSelectOptions = personOptions(clubPeople);
	const allPeopleOptions = personOptions(people);
	const captainOptions = personOptions(
		clubPeople.filter((person) => personIds.includes(person.objectId))
	);
	const canEdit = !isSignupLocked(signup.status);

	const selectedIds = (options: unknown) =>
		(Array.isArray(options) ? options : options ? [options] : []).map(
			(option: { value?: unknown }) => String(option.value)
		);

	return (
		<div className="flex col a-st gap-sm">
			<Divider text={isFemaleClass(signup.class) ? "Spielerinnen" : "Spieler"} />
			<Select
				id="edit-players"
				label={isFemaleClass(signup.class) ? "Spielerinnen" : "Spieler"}
				isMulti
				isDisabled={!canEdit}
				options={playerSelectOptions}
				value={playerSelectOptions.filter((option) =>
					personIds.includes(String(option.value))
				)}
				onChange={(options) => {
					const next = selectedIds(options);
					setPersonIds(next);
					if (captainId && !next.includes(captainId)) {
						setCaptainId("");
					}
				}}
			/>
			<Select
				id="edit-captain"
				label="Spielführer*in"
				isClearable
				isDisabled={!canEdit}
				options={captainOptions}
				value={
					captainOptions.find(
						(option) => option.value === captainId
					) || null
				}
				onChange={(option) => setCaptainId(selectString(option))}
			/>
			<Divider text="Betreuer" />
			<Select
				id="edit-coaches"
				label="Betreuer (max. 2)"
				isMulti
				isDisabled={!canEdit}
				options={allPeopleOptions}
				value={allPeopleOptions.filter((option) =>
					coachIds.includes(String(option.value))
				)}
				onChange={(options) => {
					const next = selectedIds(options).slice(0, 2);
					setCoachIds(next);
				}}
			/>
			<Divider text="Schiedsrichter" />
			<Select
				id="edit-referees"
				label="Schiedsrichter"
				isMulti
				isDisabled={!canEdit}
				options={allPeopleOptions}
				value={allPeopleOptions.filter((option) =>
					refereeIds.includes(String(option.value))
				)}
				onChange={(options) => setRefereeIds(selectedIds(options))}
			/>
			<TextInput
				id="edit-comment"
				label="Kommentar"
				isTextArea
				disabled={!canEdit}
				defaultValue={comment}
				onChange={setComment}
			/>
			{!canEdit ? (
				<p>Diese Meldung kann im aktuellen Status nicht bearbeitet werden.</p>
			) : null}
			<CreateButton
				text="Speichern"
				size="small"
				disabled={saving}
				onClick={async () => {
					setSaving(true);
					await onSave({
						personIds,
						coachIds,
						refereeIds,
						captainId: captainId || undefined,
						comment
					});
					setSaving(false);
					onClose();
				}}
			/>
		</div>
	);
};

export default EditTeam;
