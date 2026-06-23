"use client";

import { FC } from "react";
import { TextInput as Input, StatelessToggle } from "@repo/ui";
import { EmailList, ListChangeHandler } from "../../types";

export interface ListSettingsProps {
	list: EmailList;
	onListChange: ListChangeHandler;
	disabled?: boolean;
}

const ListSettings: FC<ListSettingsProps> = ({
	list,
	onListChange,
	disabled = false
}) => {
	const settings = list.settings || { static_list: true };

	return (
		<div className="flex col a-st gap-md">
			<div className="flex col gap-sm">
				<label>Titel der Liste</label>
				<Input
					id="title"
					defaultValue={list.title}
					onChange={(value) =>
						onListChange({ title: value as string })
					}
					disabled={disabled}
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
						onListChange({
							settings: {
								...settings,
								unsubscribe: value
							}
						})
					}
					disabled={disabled}
				/>
			</div>

			{settings.unsubscribe && (
				<div className="flex col gap-sm">
					<label>Abmeldelink URL</label>
					<Input
						id="unsubscribe_link"
						defaultValue={settings.unsubscribe_link || ""}
						onChange={(value) =>
							onListChange({
								settings: {
									...settings,
									unsubscribe_link: value as string
								}
							})
						}
						disabled={disabled}
						placeholder="https://example.com/unsubscribe"
					/>
				</div>
			)}
		</div>
	);
};

export default ListSettings;
