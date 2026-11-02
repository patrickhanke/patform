"use client";

import { FC, useState } from "react";
import { IconButton, Modal, Select } from "@repo/ui";
import { ChampionshipSignUp } from "@repo/types";
import { useAppContext } from "@repo/provider";
import { ChampionshipPageModel, ChampionshipRelatedData } from "@repo/modules";
import { signupStatusLabel } from "@repo/provider";
import { signupLabel, clubNumber } from "@repo/provider";
import { useDivisionCategories } from "@repo/provider";
import { selectString } from "@repo/provider";
import SignupDetails from "./SignupDetails";

const TeamRow: FC<{
	signup: ChampionshipSignUp;
	page: ChampionshipPageModel;
	related: ChampionshipRelatedData;
	allowSecondary: boolean;
	onChange: (signup: ChampionshipSignUp) => void;
	onDelete: () => void;
	onClearClub: () => void;
}> = ({
	signup,
	page,
	related,
	allowSecondary,
	onChange,
	onDelete,
	onClearClub
}) => {
	const { project } = useAppContext();
	const divisions = useDivisionCategories(project?.objectId);
	const [details, setDetails] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [confirmClear, setConfirmClear] = useState(false);
	const clubOptions = related.clubs.map((club) => ({
		value: club.objectId,
		label: club.title
	}));
	const label = signupLabel(
		signup,
		page.data.sign_ups,
		related.clubs,
		page.settings.show_division,
		divisions
	);
	const assignedToGroup = page.data.groups.some((group) =>
		group.subgroups.some((subgroup) =>
			subgroup.signup_ids.includes(signup.id)
		)
	);

	return (
		<div className="flex row a-ce j-sb gap-sm" style={{ flexWrap: "wrap" }}>
			<div
				className="flex row a-ce gap-sm"
				style={{ width: "100%", maxWidth: "400px" }}
			>
				<p>{signup.position}.</p>
				{signup.club_id ? (
					<div className="flex row a-ce j-sb gap-sm">
						<p>{label}</p>
						<IconButton
							icon="delete"
							size={16}
							onClick={() => setConfirmClear(true)}
						/>
					</div>
				) : (
					<Select
						id={`club-${signup.id}`}
						options={clubOptions}
						placeholder="Verein wählen"
						value={null}
						onChange={(option) => {
							const clubId = selectString(option);
							onChange({
								...signup,
								club_id: clubId,
								number:
									clubNumber(
										page.data.sign_ups,
										clubId,
										signup.division,
										signup.id
									) || 1
							});
						}}
					/>
				)}
			</div>
			{allowSecondary && (
				<div>
					<label htmlFor={`number-${signup.id}`}>MS-Nr.</label>
					<input
						id={`number-${signup.id}`}
						type="number"
						min={0}
						max={6}
						disabled={!allowSecondary}
						value={signup.number}
						width={64}
						onChange={(event) => {
							const number = Number(event.target.value);
							if (Number.isNaN(number) || number > 6) return;
							onChange({ ...signup, number });
						}}
					/>
				</div>
			)}
			<div style={{ width: "100%", maxWidth: "120px" }}>
				<p>
					Status: {signupStatusLabel[signup.status] || signup.status}
				</p>
			</div>
			<div className="flex row a-ce gap-sm">
				<button
					type="button"
					className="full_button sm"
					disabled={
						signup.status === "eingeladen" ||
						signup.status === "eingereicht" ||
						signup.status === "gemeldet"
					}
					onClick={() =>
						onChange({ ...signup, status: "eingeladen" })
					}
				>
					Verein einladen
				</button>
				<button
					type="button"
					className="full_button sm light"
					disabled={signup.status !== "eingereicht"}
					onClick={() => onChange({ ...signup, status: "gemeldet" })}
				>
					Meldung akzeptieren
				</button>
				<button
					type="button"
					className="full_button sm light"
					disabled={signup.status !== "eingereicht"}
					onClick={() =>
						onChange({ ...signup, status: "eingeladen" })
					}
				>
					Meldung ablehnen
				</button>
			</div>
			<div className="flex row a-ce gap-sm">
				<IconButton
					icon="view"
					disabled={
						signup.status === "erstellt" ||
						signup.status === "eingeladen"
					}
					onClick={() => setDetails(true)}
				/>
				<IconButton
					icon="delete"
					disabled={assignedToGroup}
					onClick={() => setConfirmDelete(true)}
					tooltip={
						assignedToGroup
							? "Diese Meldung ist einer Gruppe zugeordnet und kann nicht gelöscht werden."
							: undefined
					}
				/>
			</div>
			<SignupDetails
				isOpen={details}
				signup={signup}
				related={related}
				onClose={() => setDetails(false)}
			/>
			<Modal
				isOpen={confirmDelete}
				header="Meldung löschen"
				cancelButtonHandler={() => setConfirmDelete(false)}
				confirmButtonHandler={() => {
					onDelete();
					setConfirmDelete(false);
				}}
				confirmButtonText="Diese Meldung löschen"
			>
				<p>
					Die Meldung mit dem Status{" "}
					{signupStatusLabel[signup.status]} wird gelöscht.
				</p>
			</Modal>
			<Modal
				isOpen={confirmClear}
				header="Mannschaft entfernen"
				cancelButtonHandler={() => setConfirmClear(false)}
				confirmButtonHandler={() => {
					onClearClub();
					setConfirmClear(false);
				}}
				confirmButtonText="Diese Mannschaft entfernen"
			>
				<p>{label} wird aus der Meldung entfernt.</p>
			</Modal>
		</div>
	);
};

export default TeamRow;
