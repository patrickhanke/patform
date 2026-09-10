import { ContentBlock } from "@repo/ui";
import {
	FONT_SIZE_OPTIONS,
	getTextKind,
	HEADING_LEVEL_OPTIONS,
	TEXT_ALIGN_OPTIONS,
	TEXT_DIRECTION_OPTIONS,
	wrapTextHtml,
	type ListType
} from "../../../utils/textBlock";

const TextPanel = ({
	selectedBlock,
	onChange
}: {
	selectedBlock: ContentBlock;
	onChange: (updates: Partial<ContentBlock>) => void;
}) => {
	const kind = getTextKind(selectedBlock);
	const config = selectedBlock.config || {};

	const patchConfig = (
		patch: Partial<NonNullable<ContentBlock["config"]>>,
		rewrap = false
	) => {
		const nextConfig = { ...config, ...patch };
		onChange({
			config: nextConfig,
			...(rewrap
				? {
						value: wrapTextHtml(
							String(selectedBlock.value || ""),
							kind,
							{
								headingLevel: nextConfig.headingLevel,
								listType: nextConfig.listType
							}
						)
					}
				: {})
		});
	};

	return (
		<>
			{kind === "heading" && (
				<div className="property-group">
					<label className="property-label">Ebene</label>
					<select
						className="property-select"
						value={config.headingLevel || "h2"}
						onChange={(e) =>
							patchConfig(
								{
									headingLevel: e.target.value as NonNullable<
										ContentBlock["config"]
									>["headingLevel"]
								},
								true
							)
						}
					>
						{HEADING_LEVEL_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			)}

			{kind === "list" && (
				<div className="property-group">
					<label className="property-label">Listenart</label>
					<select
						className="property-select"
						value={config.listType || "ul"}
						onChange={(e) =>
							patchConfig(
								{ listType: e.target.value as ListType },
								true
							)
						}
					>
						<option value="ul">Aufzählung</option>
						<option value="ol">Nummeriert</option>
					</select>
				</div>
			)}

			<div className="property-group">
				<label className="property-label">Schriftgröße</label>
				<select
					className="property-select"
					value={config.fontSize || ""}
					onChange={(e) => patchConfig({ fontSize: e.target.value })}
				>
					{FONT_SIZE_OPTIONS.map((option) => (
						<option
							key={option.value || "default"}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="property-group">
				<label className="property-label">Ausrichtung</label>
				<select
					className="property-select"
					value={config.textAlign || "left"}
					onChange={(e) =>
						patchConfig({
							textAlign: e.target.value as NonNullable<
								ContentBlock["config"]
							>["textAlign"]
						})
					}
				>
					{TEXT_ALIGN_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="property-group">
				<label className="property-label">Schreibrichtung</label>
				<select
					className="property-select"
					value={config.textDirection || "ltr"}
					onChange={(e) =>
						patchConfig({
							textDirection: e.target.value as NonNullable<
								ContentBlock["config"]
							>["textDirection"]
						})
					}
				>
					{TEXT_DIRECTION_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</>
	);
};

export default TextPanel;
