"use client";

import { FC, useState } from "react";
import {
	ColorPicker,
	Divider,
	IconButton,
	Modal,
	Select,
	TextInput
} from "@repo/ui";
import { ChampionshipGroup } from "@repo/types";
import { useAppContext } from "@repo/provider";
import { ChampionshipPageModel, ChampionshipRelatedData } from "@repo/modules";
import { useDivisionCategories } from "@repo/provider";
import {
	groupClassLabel,
	nextSubgroupLabel,
	signupLabel
} from "@repo/provider";
import { createId } from "@repo/provider";
import { selectString } from "@repo/provider";
import AssignSignups from "./AssignSignups";

const modeOptions = [
	{ value: "gruppe", label: "Gruppe" },
	{ value: "kreuz", label: "Kreuzspiele" }
];

const GroupCard: FC<{
	group: ChampionshipGroup;
	page: ChampionshipPageModel;
	related: ChampionshipRelatedData;
	onChange: (group: ChampionshipGroup) => void;
	onDelete: () => void;
}> = ({ group, page, related, onChange, onDelete }) => {
	const { project } = useAppContext<"patstore">();
	const divisionProjectId = page.project?.objectId || project?.objectId;
	const divisions = useDivisionCategories(divisionProjectId);
	const [assign, setAssign] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);

	const removeSignup = (subgroupId: string, signupId: string) => {
		onChange({
			...group,
			subgroups: group.subgroups.map((subgroup) =>
				subgroup.id === subgroupId
					? {
							...subgroup,
							signup_ids: subgroup.signup_ids.filter(
								(id) => id !== signupId
							)
						}
					: subgroup
			)
		});
	};

	return (
		<div
			className="flex col a-st gap-sm content_element"
			style={{ padding: "1rem" }}
		>
			<div className="flex row a-ce j-sb gap-sm">
				<h2>{group.name || "—"}</h2>
				<div className="buttons_container">
					<IconButton
						icon="plus"
						onClick={() => setAssign(true)}
						text="Meldungen zuordnen"
					/>

					<IconButton
						icon="delete"
						onClick={() => setConfirmDelete(true)}
					/>
				</div>
			</div>
			<Divider showLine size="small" />
			<div className="flex row a-ce gap-sm" style={{ flexWrap: "wrap" }}>
				<TextInput
					id={`group-name-${group.id}`}
					label="Gruppenname"
					defaultValue={group.name}
					onChange={(value) => onChange({ ...group, name: value })}
				/>
				<p>
					Spielklasse:{" "}
					{groupClassLabel(group, page.data.sign_ups, divisions)}
				</p>
				<Select
					id={`group-mode-${group.id}`}
					label="Spielmodus"
					isDisabled={group.subgroups.length > 1}
					options={modeOptions}
					value={
						modeOptions.find(
							(option) => option.value === group.mode
						) || modeOptions[0]
					}
					onChange={(option) =>
						onChange({
							...group,
							mode:
								selectString(option) === "kreuz"
									? "kreuz"
									: "gruppe"
						})
					}
				/>
				<div className="flex col a-st gap-xs">
					<label>Farbe</label>
					<ColorPicker
						value={group.color || ""}
						isOverlay
						onChange={(color) => onChange({ ...group, color })}
					/>
				</div>
			</div>
			<Divider showLine size="small" />
			<div className="flex row a-st gap-md" style={{ flexWrap: "wrap" }}>
				{group.subgroups.map((subgroup) => (
					<div
						key={subgroup.id}
						className="flex col a-st gap-sm content_element"
					>
						<div className="flex row a-ce gap-sm">
							<strong>{subgroup.label}</strong>
							<IconButton
								icon="delete"
								size={16}
								onClick={() =>
									onChange({
										...group,
										subgroups: group.subgroups.filter(
											(item) => item.id !== subgroup.id
										)
									})
								}
							/>
						</div>
						{subgroup.signup_ids.map((signupId) => {
							const signup = page.data.sign_ups.find(
								(item) => item.id === signupId
							);
							if (!signup) return null;
							return (
								<div
									key={signupId}
									className="flex row a-ce gap-sm"
								>
									<span>
										{signupLabel(
											signup,
											page.data.sign_ups,
											related.clubs,
											page.settings.show_division,
											divisions
										)}
									</span>
									<IconButton
										icon="delete"
										size={16}
										onClick={() =>
											removeSignup(subgroup.id, signupId)
										}
									/>
								</div>
							);
						})}
					</div>
				))}
				<IconButton
					icon="plus"
					onClick={() =>
						onChange({
							...group,
							subgroups: [
								...group.subgroups,
								{
									id: createId(),
									label: nextSubgroupLabel(group),
									signup_ids: []
								}
							]
						})
					}
					text="Untergruppe hinzufügen"
				/>
			</div>
			<AssignSignups
				isOpen={assign}
				group={group}
				groups={page.data.groups}
				signups={page.data.sign_ups}
				clubs={related.clubs}
				projectId={divisionProjectId}
				showClass={page.settings.show_division}
				onClose={() => setAssign(false)}
				onSave={(next) => {
					onChange(next);
					setAssign(false);
				}}
			/>
			<Modal
				isOpen={confirmDelete}
				header="Gruppe löschen"
				cancelButtonHandler={() => setConfirmDelete(false)}
				confirmButtonHandler={() => {
					onDelete();
					setConfirmDelete(false);
				}}
				confirmButtonText="Gruppe löschen"
			>
				<p>{group.name || "Diese Gruppe"} wird entfernt.</p>
			</Modal>
		</div>
	);
};

export default GroupCard;
