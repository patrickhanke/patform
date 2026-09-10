import { ContentBlock } from "@repo/ui";

export const SPACER_HEIGHT_OPTIONS: { value: string; label: string }[] = [
	{ value: "8px", label: "8 px" },
	{ value: "16px", label: "16 px" },
	{ value: "24px", label: "24 px" },
	{ value: "32px", label: "32 px" },
	{ value: "48px", label: "48 px" },
	{ value: "64px", label: "64 px" },
	{ value: "80px", label: "80 px" },
	{ value: "96px", label: "96 px" }
];

const SpacerPanel = ({
	selectedBlock,
	onChange
}: {
	selectedBlock: ContentBlock;
	onChange: (key: string, value: string) => void;
}) => {
	return (
		<div className="property-group">
			<label className="property-label">Höhe</label>
			<select
				className="property-select"
				value={selectedBlock.config?.spacerHeight || "24px"}
				onChange={(e) =>
					onChange("config.spacerHeight", e.target.value)
				}
			>
				{SPACER_HEIGHT_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default SpacerPanel;
