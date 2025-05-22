import React from "react";
import { Select, StatelessToggle } from "@repo/ui";

export type DividerType = {
	size: "small" | "medium" | "large";
	showLine: boolean;
};

interface EditDividerProps {
	divider: DividerType;
	onChange: (divider: DividerType) => void;
}

const EditDivider: React.FC<EditDividerProps> = ({ divider, onChange }) => {
	return (
		<div className="flex col gap-md">
			<h3>Divider bearbeiten</h3>
			<div>
				<label>Größe</label>
				<Select
					id="divider-size"
					value={divider.size}
					options={[
						{ value: "small", label: "Klein" },
						{ value: "medium", label: "Mittel" },
						{ value: "large", label: "Groß" }
					]}
					onChange={(value) =>
						onChange({ ...divider, size: value.value })
					}
					width={120}
					isClearable={false}
					placeholder="Größe wählen"
				/>
			</div>
			<div>
				<label>Linie anzeigen</label>
				<StatelessToggle
					value={divider.showLine}
					onChange={(checked) =>
						onChange({ ...divider, showLine: checked })
					}
				/>
				<span style={{ marginLeft: 8 }}>
					{divider.showLine ? "Linie sichtbar" : "Linie ausgeblendet"}
				</span>
			</div>
		</div>
	);
};

export default EditDivider;
