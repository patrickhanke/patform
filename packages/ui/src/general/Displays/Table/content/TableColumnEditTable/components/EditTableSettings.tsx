import React, { FC } from "react";
import { EditTableSettingsProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";
import { StatelessToggle } from "@repo/ui";

const EditTableSettings: FC<EditTableSettingsProps> = ({ table, onChange }) => {
	const debouncedCallback = useDebounceCallback(onChange, 500);

	return (
		<div className="flex col gap-md">
			<div>
				<h3>Titel</h3>
				<input
					type="text"
					defaultValue={table.settings.title || ""}
					onChange={(e) =>
						debouncedCallback({
							...table,
							settings: {
								...table.settings,
								title: e.target.value
							}
						})
					}
				/>
			</div>
			<div>
				<h3>Beschreibung</h3>
				<input
					type="text"
					defaultValue={table.settings.description || ""}
					onChange={(e) =>
						debouncedCallback({
							...table,
							settings: {
								...table.settings,
								description: e.target.value
							}
						})
					}
				/>
			</div>
			<div>
				<h3>Header anzeigen</h3>
				<label
					style={{ display: "flex", alignItems: "center", gap: 8 }}
				>
					<StatelessToggle
						value={!!table.settings.showHeader}
						onChange={(e) =>
							debouncedCallback({
								...table,
								settings: {
									...table.settings,
									showHeader: e
								}
							})
						}
						disabled={false}
					/>
					<span>
						{table.settings.showHeader
							? "Header sichtbar"
							: "Header ausgeblendet"}
					</span>
				</label>
			</div>
		</div>
	);
};

export default EditTableSettings;
