"use client";

import { useDraggable } from "@dnd-kit/core";

interface SidebarItemProps {
	id: string;
	label: string;
	icon: string;
}

function SidebarItem({ id, label, icon }: SidebarItemProps) {
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

export default function Sidebar() {
	const items = [
		{ id: "text", label: "Text", icon: "T" },
		{ id: "button", label: "Button", icon: "B" },
		{ id: "image", label: "Bild", icon: "🖼" },
		{ id: "divider", label: "Trennlinie", icon: "—" },
		{ id: "layout", label: "Layout", icon: "⚏" }
	];

	return (
		<div className="content-editor-sidebar">
			<div className="sidebar-header">
				<h3>Komponenten</h3>
				<p>Ziehe um hinzuzufügen</p>
			</div>
			<div className="sidebar-items">
				{items.map((item) => (
					<SidebarItem
						key={item.id}
						id={item.id}
						label={item.label}
						icon={item.icon}
					/>
				))}
			</div>
		</div>
	);
}
