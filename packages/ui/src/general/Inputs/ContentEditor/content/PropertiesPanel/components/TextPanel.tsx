"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { ContentBlock } from "@repo/ui";
import { ColorPicker } from "@repo/ui";
import {
	FONT_SIZE_OPTIONS,
	getTextKind,
	HEADING_LEVEL_OPTIONS,
	TEXT_ALIGN_OPTIONS,
	TEXT_DIRECTION_OPTIONS,
	wrapTextHtml,
	type ListType
} from "../../../utils/textBlock";
import {
	applyInlineFormat,
	getTextEditorSelectionBold,
	getTextEditorSelectionColor,
	getTextEditorSelectionItalic,
	saveTextEditorSelection
} from "../../../utils/textEditorSelection";

const preventSelectionLoss = (blockId: string) => (event: MouseEvent) => {
	saveTextEditorSelection(blockId);
	event.preventDefault();
};

const TextPanel = ({
	selectedBlock,
	onChange
}: {
	selectedBlock: ContentBlock;
	onChange: (updates: Partial<ContentBlock>) => void;
}) => {
	const kind = getTextKind(selectedBlock);
	const config = selectedBlock.config || {};
	const [linkUrl, setLinkUrl] = useState("https://");
	const defaultTextColor = kind === "heading" ? "#333333" : "#555555";
	const [textColor, setTextColor] = useState(defaultTextColor);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);

	const refreshTextFormats = useCallback(() => {
		setTextColor(
			getTextEditorSelectionColor(selectedBlock.id) ?? defaultTextColor
		);
		setIsBold(getTextEditorSelectionBold(selectedBlock.id));
		setIsItalic(getTextEditorSelectionItalic(selectedBlock.id));
	}, [defaultTextColor, selectedBlock.id]);

	useEffect(() => {
		refreshTextFormats();

		const onSelectionChange = () => refreshTextFormats();
		document.addEventListener("selectionchange", onSelectionChange);

		return () => {
			document.removeEventListener("selectionchange", onSelectionChange);
		};
	}, [refreshTextFormats, selectedBlock.value]);

	const applyFormat = (action: Parameters<typeof applyInlineFormat>[1]) => {
		saveTextEditorSelection(selectedBlock.id);
		applyInlineFormat(selectedBlock.id, action);
		if (action.type === "color") {
			setTextColor(action.value);
		}
		refreshTextFormats();
	};

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
			<div className="properties-section-divider">
				<h4>Textformatierung</h4>
			</div>

			<div className="property-group">
				<label className="property-label">Stil</label>
				<div
					className="text-format-toolbar"
					onMouseDown={preventSelectionLoss(selectedBlock.id)}
				>
					<button
						type="button"
						className={`text-format-btn${
							isBold ? " text-format-btn--active" : ""
						}`}
						title="Fett"
						aria-pressed={isBold}
						onClick={() => applyFormat({ type: "bold" })}
					>
						B
					</button>
					<button
						type="button"
						className={`text-format-btn text-format-btn--italic${
							isItalic ? " text-format-btn--active" : ""
						}`}
						title="Kursiv"
						aria-pressed={isItalic}
						onClick={() => applyFormat({ type: "italic" })}
					>
						I
					</button>
				</div>
			</div>

			<div className="property-group">
				<label className="property-label">Textfarbe</label>
				<div
					onMouseDown={() => {
						saveTextEditorSelection(selectedBlock.id);
						refreshTextFormats();
					}}
				>
					<ColorPicker
						value={textColor}
						isOverlay
						onChange={(color) =>
							applyFormat({ type: "color", value: color })
						}
					/>
				</div>
			</div>

			<div className="property-group property-group--stack">
				<label className="property-label">Link</label>
				<div className="text-format-link">
					<input
						type="url"
						className="property-input"
						placeholder="https://..."
						value={linkUrl}
						onFocus={() =>
							saveTextEditorSelection(selectedBlock.id)
						}
						onChange={(e) => setLinkUrl(e.target.value)}
					/>
					<div
						className="text-format-link-actions"
						onMouseDown={preventSelectionLoss(selectedBlock.id)}
					>
						<button
							type="button"
							className="property-select text-format-link-btn"
							onClick={() =>
								applyFormat({ type: "link", url: linkUrl })
							}
						>
							Link setzen
						</button>
						<button
							type="button"
							className="property-clear-btn"
							onClick={() => applyFormat({ type: "unlink" })}
						>
							Link entfernen
						</button>
					</div>
				</div>
			</div>

			<div className="properties-section-divider">
				<h4>Block</h4>
			</div>

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
