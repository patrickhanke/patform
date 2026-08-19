import { FC } from "react";
import { Divider, SetPageData, StatelessToggle } from "@repo/ui";
import { WebpageComponentTable } from "@repo/types";

const EditTableSettings: FC<{
	data: WebpageComponentTable;
	setData: SetPageData<WebpageComponentTable>;
}> = ({ data, setData }) => {
	return (
		<div className="content_element">
			<h3>Einstellungen</h3>
			<Divider size="medium" showLine={false} />
			<div className="conten flex row gap-md">
				<div>
					<h4>Titel</h4>
					<input
						type="text"
						defaultValue={data.settings?.title || ""}
						onChange={(e) =>
							setData("settings.title", e.target.value, 1000)
						}
					/>
				</div>
				<div>
					<h4>Beschreibung</h4>
					<input
						type="text"
						defaultValue={data.settings?.description || ""}
						onChange={(e) =>
							setData(
								"settings.description",
								e.target.value,
								1000
							)
						}
					/>
				</div>
				<div>
					<h4>Header anzeigen</h4>
					<label
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							margin: "6px 0"
						}}
					>
						<StatelessToggle
							value={!!data.settings?.showHeader}
							onChange={(value) =>
								setData("settings.showHeader", value)
							}
							disabled={false}
						/>
						<span>
							{data.settings?.showHeader
								? "Header sichtbar"
								: "Header ausgeblendet"}
						</span>
					</label>
				</div>
			</div>
		</div>
	);
};

export default EditTableSettings;
