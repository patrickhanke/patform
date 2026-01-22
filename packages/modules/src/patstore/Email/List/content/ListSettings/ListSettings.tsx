"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { useDataHandler, useGetData } from "@repo/provider";
import { TextInput as Input, StatelessToggle } from "@repo/ui";

export interface ListSettingsProps {
	listId: string;
	onStaticListChange?: (isStatic: boolean) => void;
}

interface FilterItem {
	key: string;
	value: boolean;
}

interface ListSettings {
	static_list?: boolean;
	filters?: FilterItem[];
	unsubscribe?: boolean;
	unsubscribe_link?: string;
}

const ListSettings: FC<ListSettingsProps> = ({
	listId,
	onStaticListChange
}) => {
	const { updateData } = useDataHandler();
	const [title, setTitle] = useState<string>("");
	const [settings, setSettings] = useState<ListSettings | undefined>();
	const [loading, setLoading] = useState(false);

	const { data: list, refetch } = useGetData({
		objectName: "Item",
		fields: ["objectId", "title", "settings"],
		id: listId
	});

	useEffect(() => {
		if (list && !title) {
			setTitle(list.title || "");
		}
		if (list && !settings) {
			setSettings(list.settings || { static_list: true });
		}
	}, [list, title, settings]);

	const updateTitleHandler = useCallback(async () => {
		if (!title || title === list?.title) return;

		setLoading(true);
		await updateData({
			className: "Item",
			objectId: listId,
			updateObject: {
				title
			},
			feedback: "Titel erfolgreich aktualisiert"
		});

		await refetch();
		setLoading(false);
	}, [title, list, listId, updateData, refetch]);

	const updateSettingsHandler = useCallback(
		async (newSettings: ListSettings) => {
			console.log("newSettings", newSettings);
			setLoading(true);
			const updatedSettings = {
				...settings,
				...newSettings
			};

			await updateData({
				className: "Item",
				objectId: listId,
				updateObject: {
					settings: updatedSettings
				},
				feedback: "Einstellungen erfolgreich aktualisiert"
			});

			setSettings(updatedSettings);

			// Notify parent component about static_list change
			if (newSettings.static_list !== undefined && onStaticListChange) {
				onStaticListChange(newSettings.static_list);
			}

			await refetch();
			setLoading(false);
		},
		[settings, listId, updateData, refetch, onStaticListChange]
	);

	if (!list || !settings) {
		return <div>Lädt ...</div>;
	}

	return (
		<div className="flex col a-st gap-md">
			<div className="flex col gap-sm">
				<label>Titel der Liste</label>
				<Input
					id="title"
					defaultValue={title}
					onChange={(value) => setTitle(value as string)}
					onBlur={updateTitleHandler}
					disabled={loading}
					placeholder="Listen-Titel eingeben"
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
					value={settings.unsubscribe ?? false}
					onChange={(value) =>
						updateSettingsHandler({ unsubscribe: value })
					}
					disabled={loading}
				/>
			</div>

			{settings.unsubscribe && (
				<div className="flex col gap-sm">
					<label>Abmeldelink URL</label>
					<Input
						id="unsubscribe_link"
						defaultValue={settings.unsubscribe_link || ""}
						onChange={(value) =>
							updateSettingsHandler({
								unsubscribe_link: value as string
							})
						}
						disabled={loading}
						placeholder="https://example.com/unsubscribe"
					/>
				</div>
			)}
		</div>
	);
};

export default ListSettings;
