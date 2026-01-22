import { ContentBlock } from "@repo/ui";

const LayoutPanel = ({
	selectedBlock,
	onChange
}: {
	selectedBlock: ContentBlock;
	onChange: (key: string, value: string) => void;
}) => {
	return (
		<div className="property-group">
			<label className="property-label">Spalten Layout</label>
			<select
				className="property-select"
				value={selectedBlock.config?.columns || "50/50"}
				onChange={(e) => onChange("value", e.target.value)}
			>
				<option value="50/50">50% / 50%</option>
				<option value="33/66">33% / 66%</option>
				<option value="66/33">66% / 33%</option>
				<option value="25/75">25% / 75%</option>
				<option value="75/25">75% / 25%</option>
				<option value="33/33/33">33% / 33% / 33%</option>
			</select>
		</div>
	);
};

export default LayoutPanel;
