import { PrellballClubClass } from "@repo/types";
import {
	Divider,
	ElementSelectInterface,
	InfoBox,
	Modal,
	SelectElement
} from "@repo/ui";
import { FC, useState } from "react";
import { isRegularClub } from "@repo/modules";

const UnionClubSelection: FC<{
	club: PrellballClubClass;
	clubs: PrellballClubClass[];
	primaryId: string;
	secondaryId: string;
	setData: (key: string, value: unknown) => void;
	/** The user may not edit the club. */
	disabled?: boolean;
}> = ({ club, clubs, primaryId, secondaryId, setData, disabled = false }) => {
	const [picker, setPicker] = useState<"primary" | "secondary" | null>(null);
	const [pending, setPending] = useState("");

	const regularClubs = clubs.filter(
		(item) => item.objectId !== club.objectId && isRegularClub(item)
	);

	const clubTitle = (id: string) =>
		clubs.find((item) => item.objectId === id)?.title || "";

	const clubElements = (
		excludeId: string,
		disabled: boolean
	): SelectElement[] =>
		regularClubs
			.filter((item) => item.objectId !== excludeId)
			.map((item) => ({
				value: item.objectId,
				id: item.objectId,
				label: item.title || item.objectId,
				disabled
			}));
	const pickerElements =
		picker === "primary"
			? clubElements(secondaryId, false)
			: clubElements(primaryId, false);

	const openPicker = (next: "primary" | "secondary") => {
		setPending(next === "primary" ? primaryId : secondaryId);
		setPicker(next);
	};

	const confirmPicker = () => {
		if (!picker || !pending) return;
		setData(
			picker === "primary"
				? "settings.primary_club_id"
				: "settings.secondary_club_id",
			pending
		);
		setPicker(null);
	};
	return (
		<>
			<div className="flex row a-st j-sb gap-sm">
				<div>
					<h3>Hauptverein</h3>
					<p>{clubTitle(primaryId) || "Nicht ausgewählt"}</p>
				</div>
				<div>
					<button
						type="button"
						className="full_button md primary"
						onClick={() => openPicker("primary")}
						disabled={disabled}
					>
						{primaryId ? "Ändern" : "Auswählen"}
					</button>
				</div>
			</div>
			<Divider showLine={false} size="medium" />
			<div className="flex row a-st j-sb gap-sm">
				<div>
					<h3>Nebenverein</h3>
					<p>{clubTitle(secondaryId) || "Nicht ausgewählt"}</p>
					{!secondaryId ? (
						<InfoBox
							status="warning"
							text="Wähle zuerst den Hauptverein."
						/>
					) : null}
				</div>
				<div>
					<button
						type="button"
						className="full_button md primary"
						onClick={() => openPicker("secondary")}
						disabled={disabled || !primaryId}
					>
						{secondaryId ? "Ändern" : "Auswählen"}
					</button>
				</div>
			</div>
			<Modal
				isOpen={picker !== null}
				header={
					picker === "primary"
						? "Hauptverein auswählen"
						: "Nebenverein auswählen"
				}
				cancelButtonHandler={() => setPicker(null)}
				confirmButtonHandler={confirmPicker}
				confirmButtonText="Übernehmen"
				buttonDisabled={[false, !pending]}
			>
				<ElementSelectInterface
					elements={pickerElements}
					selectedElements={pickerElements.filter(
						(item) => item.value === pending
					)}
					onSelect={(selected) =>
						setPending(String(selected[0]?.value ?? ""))
					}
					isSearchable
				/>
			</Modal>
		</>
	);
};

export default UnionClubSelection;
