"use client";

import { FC } from "react";
import { DatePicker, Editor, StatelessToggle, TextInput } from "@repo/ui";
import { ChampionshipTabProps } from "../types";
import SettingRow from "../components/SettingRow";

const Settings: FC<ChampionshipTabProps> = ({
	championship,
	onUpdate,
	loading
}) => {
	const save = (patch: Parameters<ChampionshipTabProps["onUpdate"]>[0]) =>
		onUpdate(patch, "Einstellungen aktualisiert");

	return (
		<div className="flex col a-st gap-sm">
			<SettingRow label="Titel">
				<TextInput
					id="title"
					defaultValue={championship.title}
					disabled={loading}
					onChange={(value) => save({ title: value })}
				/>
			</SettingRow>
			<SettingRow
				label="Saison"
				description="Freitext, da es keine Saison-Klasse gibt."
			>
				<TextInput
					id="season"
					defaultValue={championship.season || ""}
					disabled={loading}
					onChange={(value) => save({ season: value })}
				/>
			</SettingRow>
			<SettingRow label="Meldefrist">
				<DatePicker
					id="deadline"
					type="date"
					defaultValue={championship.deadline || ""}
					disabled={loading}
					onChange={(value) => save({ deadline: value })}
				/>
			</SettingRow>
			<SettingRow label="Kontakt-E-Mail">
				<TextInput
					id="email"
					defaultValue={championship.email || ""}
					disabled={loading}
					onChange={(value) => save({ email: value })}
				/>
			</SettingRow>
			<SettingRow label="Spielklasse anzeigen">
				<StatelessToggle
					value={championship.show_class}
					disabled={loading}
					onChange={(value) => save({ show_class: value })}
				/>
			</SettingRow>
			<SettingRow label="Spiele außer Konkurrenz">
				<StatelessToggle
					value={championship.ak_games}
					disabled={loading}
					onChange={(value) => save({ ak_games: value })}
				/>
			</SettingRow>
			<SettingRow label="Offene Meldung">
				<StatelessToggle
					value={championship.open_signup}
					disabled={loading}
					onChange={(value) => save({ open_signup: value })}
				/>
			</SettingRow>
			<SettingRow label="Freie Meldung">
				<StatelessToggle
					value={championship.free_signup}
					disabled={loading}
					onChange={(value) => save({ free_signup: value })}
				/>
			</SettingRow>
			<SettingRow label="Zweitmannschaften erlauben">
				<StatelessToggle
					value={championship.secondary_teams}
					disabled={loading}
					onChange={(value) => save({ secondary_teams: value })}
				/>
			</SettingRow>
			<SettingRow
				label="Gruppenmodus"
				description="Ohne Gruppenmodus steht der Import-Tab zur Verfügung."
			>
				<StatelessToggle
					value={championship.group_mode}
					disabled={loading}
					onChange={(value) => save({ group_mode: value })}
				/>
			</SettingRow>
			<SettingRow label="Spielklassen (kommagetrennt)">
				<TextInput
					id="classes"
					defaultValue={(championship.classes || []).join(", ")}
					disabled={loading}
					onChange={(value) =>
						save({
							classes: value
								.split(",")
								.map((item) => item.trim())
								.filter(Boolean)
						})
					}
				/>
			</SettingRow>
			<div className="flex col a-st gap-sm">
				<label>Informationen</label>
				<Editor
					id="info"
					content={championship.info || ""}
					disabled={loading}
					onChange={(value) => save({ info: value })}
				/>
			</div>
		</div>
	);
};

export default Settings;
