"use client";

import { useDraggable } from "@dnd-kit/core";

export const PALETTE_LABELS: Record<string, string> = {
	section: "Abschnitt",
	heading: "Titel",
	text: "Text",
	list: "Liste",
	button: "Button",
	image: "Bild",
	divider: "Trennlinie",
	spacer: "Abstand",
	layout: "Layout"
};

interface PaletteItemProps {
	id: string;
	label: string;
	icon: string;
}

function PaletteItem({ id, label, icon }: PaletteItemProps) {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: `sidebar-${id}`
	});

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className={`sidebar-item ${isDragging ? "dragging" : ""}`}
		>
			<div className="sidebar-item-icon">{icon}</div>
			<div className="sidebar-item-label">{label}</div>
		</div>
	);
}

export default function ComponentPalette({
	multipleSections = false,
	onImportContent
}: {
	multipleSections?: boolean;
	onImportContent?: () => void;
}) {
	const items = [
		...(multipleSections
			? [{ id: "section", label: PALETTE_LABELS.section, icon: "§" }]
			: []),
		{ id: "heading", label: PALETTE_LABELS.heading, icon: "H" },
		{ id: "text", label: PALETTE_LABELS.text, icon: "T" },
		{ id: "list", label: PALETTE_LABELS.list, icon: "☰" },
		{ id: "button", label: PALETTE_LABELS.button, icon: "B" },
		{ id: "image", label: PALETTE_LABELS.image, icon: "🖼" },
		{ id: "divider", label: PALETTE_LABELS.divider, icon: "—" },
		{ id: "spacer", label: PALETTE_LABELS.spacer, icon: "↕" },
		{ id: "layout", label: PALETTE_LABELS.layout, icon: "⚏" }
	];

	return (
		<div className="component-palette">
			<p className="component-palette-hint">
				Ziehe Komponenten auf die Fläche
			</p>
			<div className="sidebar-items">
				{items.map((item) => (
					<PaletteItem
						key={item.id}
						id={item.id}
						label={item.label || item.id}
						icon={item.icon}
					/>
				))}
				{onImportContent && (
					<button
						type="button"
						className="sidebar-item sidebar-item--action"
						onClick={onImportContent}
					>
						<div className="sidebar-item-icon">⧉</div>
						<div className="sidebar-item-label">
							Inhalt importieren
						</div>
					</button>
				)}
			</div>
		</div>
	);
}
