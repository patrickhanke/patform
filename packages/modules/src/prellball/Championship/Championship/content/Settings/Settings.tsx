"use client";

import { FC } from "react";
import {
	DatePicker,
	Divider,
	Editor,
	Select,
	StatelessToggle,
	TextInput,
	usePageData
} from "@repo/ui";
import { ChampionshipPageModel, ChampionshipTabProps } from "@repo/modules";
import {
	selectStrings,
	selectedDivisionIds,
	withDivisionCategories,
	useAppContext,
	useDivisionCategories,
	useRefereeCategories,
	toDateInput
} from "@repo/provider";
import SelectStaffLead from "./components/SelectStaffLead";

const ROLES = ["lVLJsMzfp6", "T3lnYiKGwF"];

const Settings: FC<ChampionshipTabProps> = ({ related }) => {
	const { project, roles } = useAppContext<"patstore">();
	const divisions = useDivisionCategories(project?.objectId);
	const referees = useRefereeCategories(project?.objectId);
	const { data: page, setData } = usePageData<ChampionshipPageModel>();

	console.log("users", related.users);
	console.log("roles", ROLES);

	console.log("page", page);
	if (!page) return null;

	const staff_roles = roles.filter((role) => ROLES.includes(role.objectId));
	const staff_user_ids = staff_roles.flatMap((role) =>
		role.users.edges.map((user) => user?.node?.objectId)
	);

	console.log("staff_user_ids", staff_user_ids);


	const staffUsers = related.users.filter((user) =>
		staff_user_ids.includes(user.objectId)
	);
	const divisionOptions = divisions.map((item) => ({
		value: item.objectId,
		label: item.title || item.label || item.objectId
	}));
	const selectedDivisions = selectedDivisionIds(page.categories, divisions);
	const downloadOptions = related.downloads.map((item) => ({
		value: item.objectId,
		label: item.title || item.objectId
	}));

	return (
		<div className="flex col a-st gap-md" style={{ flexWrap: "wrap" }}>
			<div className="flex col a-st gap-sm" style={{ flex: "1 1 320px" }}>
				<div className="flex row a-st j-sb">
					<label>Spielklassen</label>
					<Select
						id="championship-division"
						isMulti
						options={divisionOptions}
						value={divisionOptions.filter((option) =>
							selectedDivisions.includes(option.value)
						)}
						onChange={(option) =>
							setData(
								"categories",
								withDivisionCategories(
									page.categories,
									divisions,
									selectStrings(option)
								)
							)
						}
					/>
				</div>
				<Divider showLine size="small" />
				<div className="flex row a-st j-sb">
					<div>
						<label>Gruppenmodus</label>
						<p>
							Legt fest, ob es Kreuzspiele zwischen den Gruppen
							gibt.
						</p>
					</div>
					<StatelessToggle
						value={page?.settings?.group_mode}
						onChange={(value) =>
							setData("settings.group_mode", value)
						}
					/>
				</div>
				<Divider showLine size="small" />
				<div className="flex row a-st j-sb">
					<div>
						<label>Meldefrist</label>
						<p>
							Legt fest, wann die Meldung für den Turnierablauf
							geschlossen wird.
						</p>
					</div>
					<DatePicker
						type="date"
						defaultValue={toDateInput(page?.settings?.deadline)}
						onChange={(value) =>
							setData("settings.deadline", value)
						}
					/>
				</div>
				<Divider showLine size="small" />
				<div className="flex row a-st j-sb">
					<div>
						<label>Staffelleitung</label>
						<p>Legt fest, wer die Staffelleitung ist.</p>
					</div>
					<SelectStaffLead
						users={staffUsers}
						value={page.settings?.staff_lead_id}
						onChange={(userId) =>
							setData("settings.staff_lead_id", userId)
						}
					/>
				</div>
				<Divider showLine size="small" />
				<div className="flex row a-st j-sb">
					<div>
						<label>Schiedsrichterstufe</label>
						<p>
							Wähle die Schiedsrichterstufen für diesen Wettkampf.
						</p>
					</div>
					<Select
						id="championship-referees"
						isMulti
						options={referees.map((item) => ({
							value: item.objectId,
							label: item.title || item.label || item.objectId
						}))}
						value={referees
							.filter((item) =>
								(page.settings?.referees_class || []).includes(
									item.objectId
								)
							)
							.map((item) => ({
								value: item.objectId,
								label: item.title || item.label || item.objectId
							}))}
						onChange={(option) =>
							setData(
								"settings.referees_class",
								selectStrings(option)
							)
						}
					/>
				</div>
				<Divider showLine size="small" />
				<div className="flex row a-st j-sb">
					<div>
						<label>E-Mail</label>
						<p>
							Legt fest, welche E-Mail als Kontakt auf der
							Webseite angezeigt wird.
						</p>
					</div>
					<TextInput
						id="championship-email"
						defaultValue={page.settings?.email || ""}
						onChange={(value) => setData("settings.email", value)}
					/>
				</div>
				<Divider showLine size="small" />
				<div className="flex row a-st j-sb">
					<div>
						<label>Spielklassen anzeigen</label>
						<p>
							Legt fest, ob die Spielklassen auf der Webseite
							angezeigt werden.
						</p>
					</div>
					<StatelessToggle
						value={page.settings?.show_division}
						onChange={(value) =>
							setData("settings.show_division", value)
						}
					/>
				</div>
				<Divider showLine size="small" />
				<div className="flex row a-st j-sb">
					<div>
						<label>Spiele außer Konkurrenz</label>
						<p>
							Legt fest, ob Spiele außer Konkurrenz erlaubt sind.
						</p>
					</div>
					<StatelessToggle
						value={page.settings?.ak_games}
						onChange={(value) =>
							setData("settings.ak_games", value)
						}
					/>
				</div>
				<Divider showLine size="small" />

				<div className="flex row a-st j-sb">
					<div>
						<label>Offene Meldung</label>
						<p>
							Wenn aktiv, darf jeder Vereine für diesen Wettkampf
							melden.
						</p>
					</div>
					<StatelessToggle
						value={page.settings?.open_signup}
						onChange={(value) =>
							setData("settings.open_signup", value)
						}
					/>
				</div>
			</div>
			<Divider showLine size="small" />
			<div className="flex row a-st j-sb gap-sm">
				<div>
					<label>Informationen</label>
					<p>
						Legt fest, welche Informationen auf der Webseite
						angezeigt werden.
					</p>
				</div>
				<div style={{ flex: "1 1 420px", maxWidth: "420px" }}>
					<Editor
						id="championship-info"
						label="Informationen"
						content={page.text || ""}
						onChange={(value) => setData("text", value)}
					/>
				</div>
			</div>
			<Divider showLine size="small" />
			<div className="flex row a-st gap-sm j-sb">
				<div>
					<label>Downloads</label>
					<p>
						Legt fest, welche Downloads auf der Webseite angezeigt
						werden.
					</p>
				</div>
				<Select
					id="championship-downloads"
					isMulti
					options={downloadOptions}
					value={downloadOptions.filter((option) =>
						page.documents?.includes(option.value)
					)}
					onChange={(option) =>
						setData("documents", selectStrings(option))
					}
				/>
			</div>
		</div>
	);
};

export default Settings;
