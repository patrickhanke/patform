"use client";

import { FC, useCallback } from "react";
import { TextInput as Input, StatelessToggle, usePageData } from "@repo/ui";
import { EmailList } from "@repo/types";

export interface ListSettingsProps {
	list: EmailList;
	disabled?: boolean;
}

const ListSettings: FC<ListSettingsProps> = ({ list, disabled = false }) => {
	const { data, setData } = usePageData(
		{
			objectId: list.objectId,
			initialData: {
				title: list.title,
				settings: list.settings
			}
		},
		{
			className: "Email",
			message: "Liste aktualisiert",
			updateObject: (data) => ({
				title: data.title,
				settings: data.settings
			})
		}
	);

	const onListChange = useCallback(
		(key: string, value: string | boolean) => {
			setData(key, value);
		},
		[setData]
	);

	return (
		<div className="flex col a-st gap-md">
			<div className="flex col gap-sm">
				<label>Titel der Liste</label>
				<Input
					id="title"
					defaultValue={data?.title ?? list.title}
					onChange={(value) => onListChange("title", value as string)}
					disabled={disabled}
					placeholder="Listen-Titel eingeben"
				/>
			</div>

			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col a-st">
					<label>Statische Liste</label>
					<p>Nutzer werden der Liste manuell hinzugefügt.</p>
				</div>
				<StatelessToggle
					value={data?.settings?.static_list ?? false}
					onChange={(value) =>
						onListChange("settings.static_list", value)
					}
					disabled={disabled}
				/>
			</div>
			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col a-st">
					<label>Abmeldelink</label>
					<p>
						Abmeldelink aktivieren, um Mitgliedern die Möglichkeit
						zu geben, sich von der Liste abzumelden.
					</p>
				</div>
				<StatelessToggle
					value={data?.settings?.unsubscribe ?? false}
					onChange={(value) =>
						onListChange("settings.unsubscribe", value)
					}
					disabled={disabled}
				/>
			</div>

			{data?.settings?.unsubscribe && (
				<div className="flex col gap-sm">
					<label>Abmeldelink URL</label>
					<Input
						id="unsubscribe_link"
						defaultValue={data?.settings?.unsubscribe_link || ""}
						onChange={(value) =>
							onListChange(
								"settings.unsubscribe_link",
								value as string
							)
						}
						disabled={disabled}
						placeholder="https://example.com/unsubscribe"
					/>
				</div>
			)}
			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col a-st">
					<label>Alle Nutzer</label>
					<p>Alle Nutzer des Projekts erhalten die E-Mail.</p>
				</div>
				<StatelessToggle
					value={data?.settings?.include_all_users ?? false}
					onChange={(value) =>
						onListChange("settings.include_all_users", value)
					}
					disabled={disabled || data?.settings?.static_list}
				/>
			</div>
		</div>
	);
};

export default ListSettings;
