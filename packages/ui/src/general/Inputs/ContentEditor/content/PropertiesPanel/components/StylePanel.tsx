"use client";

import { useState } from "react";
import { Modal, ColorSelect } from "@repo/ui";
import colors from "../../../../ColorSelect/constants/colors";
import type { ColorValues } from "../../../../ColorSelect/types";
import type { ContentBlock } from "../../../ContentEditor";
import {
	SPACING_OPTIONS,
	COLOR_HEX,
	blockSupportsSizing,
	type ContentBlockStyle,
	type FlexAlignItems,
	type FlexJustifyContent,
	type SpacingScale
} from "../../../styles";

const ALIGN_ITEMS: { value: FlexAlignItems; label: string }[] = [
	{ value: "flex-start", label: "Start" },
	{ value: "center", label: "Center" },
	{ value: "flex-end", label: "End" },
	{ value: "stretch", label: "Stretch" },
	{ value: "baseline", label: "Baseline" }
];

const JUSTIFY_CONTENT: { value: FlexJustifyContent; label: string }[] = [
	{ value: "flex-start", label: "Start" },
	{ value: "center", label: "Center" },
	{ value: "flex-end", label: "End" },
	{ value: "space-between", label: "Space between" },
	{ value: "space-around", label: "Space around" },
	{ value: "space-evenly", label: "Space evenly" }
];

function colorLabel(value?: ColorValues) {
	if (!value) return null;
	return colors.find((c) => c.value === value)?.label || value;
}

function ColorField({
	label,
	value,
	onChange,
	onClear
}: {
	label: string;
	value?: ColorValues;
	onChange: (color: ColorValues) => void;
	onClear: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [draft, setDraft] = useState<ColorValues>(value || "blue");

	const openModal = () => {
		setDraft(value || "blue");
		setIsOpen(true);
	};

	return (
		<div className="property-group">
			<label className="property-label">{label}</label>
			<div className="style-color-trigger">
				<button
					type="button"
					className="property-select style-color-button"
					onClick={openModal}
				>
					{value ? (
						<span className="style-color-button-inner">
							<span
								className="style-color-swatch"
								style={{
									backgroundColor: COLOR_HEX[value]
								}}
							/>
							{colorLabel(value)}
						</span>
					) : (
						"Farbe wählen"
					)}
				</button>
				{value && (
					<button
						type="button"
						className="property-clear-btn"
						onClick={onClear}
					>
						Entfernen
					</button>
				)}
			</div>

			<Modal
				header={label}
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(draft);
					setIsOpen(false);
				}}
				confirmButtonText="Übernehmen"
				cancelButtonText="Abbrechen"
				styles={{ minHeight: "280px" }}
			>
				<div className="style-color-modal">
					<p className="style-color-modal-hint">
						Wähle eine Farbe aus der Liste.
					</p>
					<ColorSelect value={draft} onChange={setDraft} />
					{draft && (
						<div className="style-color-modal-preview">
							<span
								className="style-color-swatch style-color-swatch--lg"
								style={{ backgroundColor: COLOR_HEX[draft] }}
							/>
							<span>{colorLabel(draft)}</span>
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
}

const StylePanel = ({
	selectedBlock,
	onStyleChange
}: {
	selectedBlock: ContentBlock;
	onStyleChange: (style: ContentBlockStyle) => void;
}) => {
	const style = selectedBlock.style || {};
	const showSizing = blockSupportsSizing(selectedBlock.type);
	const showFlex = selectedBlock.type === "layout";

	const patch = (partial: ContentBlockStyle) => {
		onStyleChange({
			...style,
			...partial,
			flex: partial.flex
				? { ...style.flex, ...partial.flex }
				: style.flex
		});
	};

	const clearKey = (key: keyof ContentBlockStyle) => {
		const next = { ...style };
		delete next[key];
		onStyleChange(next);
	};

	return (
		<div className="style-panel">
			<ColorField
				label="Hintergrundfarbe"
				value={style.backgroundColor}
				onChange={(color) => patch({ backgroundColor: color })}
				onClear={() => clearKey("backgroundColor")}
			/>

			<ColorField
				label="Textfarbe"
				value={style.color}
				onChange={(color) => patch({ color })}
				onClear={() => clearKey("color")}
			/>

			{showSizing && (
				<>
					<div className="property-group">
						<label className="property-label">Padding</label>
						<select
							className="property-select"
							value={style.padding || ""}
							onChange={(e) => {
								const value = e.target.value as
									| SpacingScale
									| "";
								if (!value) clearKey("padding");
								else patch({ padding: value });
							}}
						>
							<option value="">Standard</option>
							{SPACING_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div className="property-group">
						<label className="property-label">Margin</label>
						<select
							className="property-select"
							value={style.margin || ""}
							onChange={(e) => {
								const value = e.target.value as
									| SpacingScale
									| "";
								if (!value) clearKey("margin");
								else patch({ margin: value });
							}}
						>
							<option value="">Standard</option>
							{SPACING_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</>
			)}

			{showFlex && (
				<>
					<div className="property-group">
						<label className="property-label">Align Items</label>
						<select
							className="property-select"
							value={style.flex?.alignItems || "stretch"}
							onChange={(e) =>
								patch({
									flex: {
										alignItems: e.target
											.value as FlexAlignItems
									}
								})
							}
						>
							{ALIGN_ITEMS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div className="property-group">
						<label className="property-label">Justify Content</label>
						<select
							className="property-select"
							value={style.flex?.justifyContent || "flex-start"}
							onChange={(e) =>
								patch({
									flex: {
										justifyContent: e.target
											.value as FlexJustifyContent
									}
								})
							}
						>
							{JUSTIFY_CONTENT.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div className="property-group">
						<label className="property-label">Gap</label>
						<select
							className="property-select"
							value={style.flex?.gap || "md"}
							onChange={(e) =>
								patch({
									flex: {
										gap: e.target.value as SpacingScale
									}
								})
							}
						>
							{SPACING_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div className="property-group">
						<label className="property-label">
							<input
								type="checkbox"
								className="property-checkbox"
								checked={Boolean(style.flex?.wrap)}
								onChange={(e) =>
									patch({
										flex: { wrap: e.target.checked }
									})
								}
							/>{" "}
							Flex Wrap
						</label>
					</div>

					<div className="property-group">
						<label className="property-label">
							<input
								type="checkbox"
								className="property-checkbox"
								checked={Boolean(style.flex?.changeToColumn)}
								onChange={(e) =>
									patch({
										flex: {
											changeToColumn: e.target.checked
										}
									})
								}
							/>{" "}
							Auf Mobile als Spalte
						</label>
					</div>
				</>
			)}
		</div>
	);
};

export default StylePanel;
