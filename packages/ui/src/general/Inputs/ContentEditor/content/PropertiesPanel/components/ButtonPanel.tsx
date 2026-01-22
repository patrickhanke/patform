import { ContentBlock } from "@repo/ui";

const ButtonPanel = ({
	selectedBlock,
	onChange
}: {
	selectedBlock: ContentBlock;
	onChange: (key: string, value: string) => void;
}) => {
	return (
		<>
			<div className="property-group">
				<label className="property-label">
					Button Text (Button-Text)
				</label>
				<input
					type="text"
					className="property-input"
					value={selectedBlock.config?.buttonText || ""}
					onChange={(e) =>
						onChange("config.buttonText", e.target.value)
					}
				/>
			</div>

			<div className="property-group">
				<label className="property-label">
					Button URL (Button-URL)
				</label>
				<input
					type="text"
					className="property-input"
					value={selectedBlock.config?.buttonUrl || ""}
					onChange={(e) =>
						onChange("config.buttonUrl", e.target.value)
					}
				/>
			</div>

			<div className="property-group">
				<label className="property-label">Ausrichtung</label>
				<select
					className="property-select"
					value={selectedBlock.config?.alignment || "center"}
					onChange={(e) =>
						onChange("config.alignment", e.target.value)
					}
				>
					<option value="left">Left</option>
					<option value="center">Center</option>
					<option value="right">Right</option>
				</select>
			</div>
		</>
	);
};

export default ButtonPanel;
