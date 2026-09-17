"use client";

import { useContext, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { ContentClass, EmailContentComponent } from "@repo/types";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import type { ContentBlock } from "../ContentEditor";

export type TemplateDragData = {
	type: "template";
	title: string;
	content: ContentBlock[];
};

const isEmailTemplate = (
	item: ContentClass
): item is ContentClass & {
	data: EmailContentComponent;
} => {
	if (item.type !== "email" || item.active !== true) {
		return false;
	}
	const data = item.data as EmailContentComponent | undefined;
	return Array.isArray(data?.content) && data.content.length > 0;
};

function TemplateItem({
	objectId,
	title,
	content
}: {
	objectId: string;
	title: string;
	content: ContentBlock[];
}) {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: `template-${objectId}`,
		data: {
			type: "template",
			title,
			content
		} satisfies TemplateDragData
	});

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className={`sidebar-item sidebar-item--template ${
				isDragging ? "dragging" : ""
			}`}
		>
			<div className="sidebar-item-icon">⧉</div>
			<div className="sidebar-item-label">{title}</div>
		</div>
	);
}

export default function TemplatesPalette() {
	const { currentModule } = useContext(PatstoreAppContext);

	const { data: contentItems, loading } = useFindData({
		objectName: "Content",
		fields: ["objectId", "title", "type", "active", "data"],
		moduleId: currentModule?.objectId,
		filters: [
			{
				key: "type",
				value: "email",
				operator: "equalTo"
			}
		],
		limit: 100,
		skip: 0,
		skipQuery: !currentModule?.objectId
	});

	const templates = useMemo(
		() => ((contentItems || []) as ContentClass[]).filter(isEmailTemplate),
		[contentItems]
	);

	return (
		<div className="templates-palette">
			<div className="component-palette-section-divider">
				<h4>Templates</h4>
			</div>
			{loading && (
				<p className="component-palette-hint">
					Templates werden geladen…
				</p>
			)}
			{!loading && templates.length === 0 && (
				<p className="component-palette-hint">
					Keine aktiven E-Mail-Templates mit Inhalt gefunden.
				</p>
			)}
			<div className="sidebar-items">
				{templates.map((item) => (
					<TemplateItem
						key={item.objectId}
						objectId={item.objectId}
						title={item.title || "Ohne Titel"}
						content={(item.data as EmailContentComponent).content}
					/>
				))}
			</div>
		</div>
	);
}
