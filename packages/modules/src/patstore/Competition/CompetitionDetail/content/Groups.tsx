"use client";

import { FC, useState } from "react";
import {
	CreateButton,
	IconButton,
	Select,
	StatelessToggle,
	TextInput
} from "@repo/ui";
import { CompetitionTabProps } from "../types";
import { createGroup, createSubgroup } from "../functions/factories";
import { signupLabel } from "../functions/getTeamLabel";
import { selectString } from "../functions/selectValue";

const Groups: FC<CompetitionTabProps> = ({
	Competition,
	related,
	onUpdate,
	loading
}) => {
	const [name, setName] = useState("Neue Gruppe");

	const signupOptions = Competition.signups.map((signup) => ({
		value: signup.id,
		label: signupLabel(signup, related.clubs, Competition.show_class)
	}));

	const saveGroups = (
		groups: CompetitionTabProps["Competition"]["groups"],
		feedback: string
	) => onUpdate({ groups }, feedback);

	return (
		<div className="flex col a-st gap-sm">
			<div className="flex row a-ce gap-sm">
				<TextInput
					id="groupName"
					label="Gruppenname"
					defaultValue={name}
					onChange={setName}
				/>
				<CreateButton
					text="Gruppe erstellen"
					size="small"
					disabled={loading}
					onClick={() => {
						saveGroups(
							[...Competition.groups, createGroup({ name })],
							"Gruppe erstellt"
						);
						setName("Neue Gruppe");
					}}
				/>
			</div>
			{Competition.groups.map((group) => (
				<div key={group.id} className="flex col a-st gap-sm">
					<div className="flex row a-ce j-sb gap-sm">
						<TextInput
							id={`${group.id}-name`}
							defaultValue={group.name}
							disabled={loading}
							onChange={(value) =>
								saveGroups(
									Competition.groups.map((item) =>
										item.id === group.id
											? { ...item, name: value }
											: item
									),
									"Gruppe umbenannt"
								)
							}
						/>
						<Select
							id={`${group.id}-mode`}
							options={[
								{ value: "gruppe", label: "Gruppe" },
								{ value: "kreuz", label: "Kreuz" }
							]}
							value={{
								value: group.mode,
								label:
									group.mode === "kreuz" ? "Kreuz" : "Gruppe"
							}}
							onChange={(option) =>
								saveGroups(
									Competition.groups.map((item) =>
										item.id === group.id
											? {
													...item,
													mode:
														selectString(option) ===
														"kreuz"
															? "kreuz"
															: "gruppe"
												}
											: item
									),
									"Spielmodus aktualisiert"
								)
							}
						/>
						<StatelessToggle
							label="Abgeschlossen"
							value={group.closed}
							disabled={loading}
							onChange={(value) =>
								saveGroups(
									Competition.groups.map((item) =>
										item.id === group.id
											? { ...item, closed: value }
											: item
									),
									"Gruppenstatus aktualisiert"
								)
							}
						/>
						<IconButton
							icon="delete"
							disabled={loading}
							onClick={() =>
								saveGroups(
									Competition.groups.filter(
										(item) => item.id !== group.id
									),
									"Gruppe gelöscht"
								)
							}
						/>
					</div>
					{group.subgroups.map((subgroup) => (
						<div key={subgroup.id} className="flex col a-st gap-sm">
							<div className="flex row a-ce gap-sm">
								<TextInput
									id={`${subgroup.id}-label`}
									defaultValue={subgroup.label}
									disabled={loading}
									onChange={(value) =>
										saveGroups(
											Competition.groups.map((item) =>
												item.id === group.id
													? {
															...item,
															subgroups:
																item.subgroups.map(
																	(sub) =>
																		sub.id ===
																		subgroup.id
																			? {
																					...sub,
																					label: value
																				}
																			: sub
																)
														}
													: item
											),
											"Untergruppe umbenannt"
										)
									}
								/>
							</div>
							<Select
								id={`${subgroup.id}-signups`}
								label="Mannschaften"
								isMulti
								options={signupOptions}
								value={signupOptions.filter((option) =>
									subgroup.signupIds.includes(
										String(option.value)
									)
								)}
								onChange={(options) => {
									const signupIds = (
										Array.isArray(options)
											? options
											: options
												? [options]
												: []
									).map((option) => String(option.value));
									saveGroups(
										Competition.groups.map((item) =>
											item.id === group.id
												? {
														...item,
														signupIds: Array.from(
															new Set([
																...item.subgroups
																	.filter(
																		(sub) =>
																			sub.id !==
																			subgroup.id
																	)
																	.flatMap(
																		(sub) =>
																			sub.signupIds
																	),
																...signupIds
															])
														),
														subgroups:
															item.subgroups.map(
																(sub) =>
																	sub.id ===
																	subgroup.id
																		? {
																				...sub,
																				signupIds
																			}
																		: sub
															)
													}
												: item
										),
										"Mannschaften zugeordnet"
									);
								}}
							/>
						</div>
					))}
					<CreateButton
						text="Untergruppe hinzufügen"
						size="small"
						disabled={loading}
						onClick={() =>
							saveGroups(
								Competition.groups.map((item) =>
									item.id === group.id
										? {
												...item,
												subgroups: [
													...item.subgroups,
													createSubgroup({
														label: `Gruppe ${String.fromCharCode(65 + item.subgroups.length)}`
													})
												]
											}
										: item
								),
								"Untergruppe erstellt"
							)
						}
					/>
				</div>
			))}
		</div>
	);
};

export default Groups;
