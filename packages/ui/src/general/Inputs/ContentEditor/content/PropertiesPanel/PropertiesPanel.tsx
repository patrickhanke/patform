"use client";

import { set } from "lodash";
import { Tabs } from "@chakra-ui/react";
import { ContentBlock } from "../../ContentEditor";
import type { ContentBlockStyle } from "../../styles";
import {
	ImagePanel,
	TextPanel,
	ButtonPanel,
	LayoutPanel,
	SectionPanel,
	StylePanel,
	ContentPanel,
	SpacerPanel
} from "./components";
import { useCallback } from "react";
import ComponentPalette from "../../components/Sidebar";

export type PropertiesTab = "components" | "settings";

interface PropertiesPanelProps {
	selectedBlock: ContentBlock | null;
	onBlockUpdate: (id: string, updates: Partial<ContentBlock>) => void;
	multipleSections?: boolean;
	onImportContent?: () => void;
	tab?: PropertiesTab;
	onTabChange?: (tab: PropertiesTab) => void;
}

export default function PropertiesPanel({
	selectedBlock,
	onBlockUpdate,
	multipleSections = false,
	onImportContent,
	tab = "components",
	onTabChange
}: PropertiesPanelProps) {
	const handleUpdate = useCallback(
		(field: string, value: string) => {
			if (!field || !selectedBlock) return;
			set(selectedBlock, field, value) as Partial<ContentBlock>;
			onBlockUpdate(selectedBlock.id, selectedBlock);
		},
		[selectedBlock, onBlockUpdate]
	);

	const handleStyleChange = useCallback(
		(style: ContentBlockStyle) => {
			if (!selectedBlock) return;
			onBlockUpdate(selectedBlock.id, { style });
		},
		[selectedBlock, onBlockUpdate]
	);

	return (
		<div className="content-editor-properties">
			<div className="properties-tabs-root">
				<Tabs.Root
					value={tab}
					onValueChange={(details) => {
						const value =
							typeof details === "string"
								? details
								: details.value;
						if (value === "components" || value === "settings") {
							onTabChange?.(value);
						}
					}}
					variant="line"
				>
					<Tabs.List className="properties-tabs">
						<Tabs.Trigger value="components">
							Komponenten
						</Tabs.Trigger>
						<Tabs.Trigger value="settings">
							Einstellungen
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content
						value="components"
						className="properties-tab-content"
					>
						<ComponentPalette
							multipleSections={multipleSections}
							onImportContent={onImportContent}
						/>
					</Tabs.Content>
					<Tabs.Content
						value="settings"
						className="properties-tab-content"
					>
						{!selectedBlock ? (
							<div className="properties-empty">
								<p>
									Wähle einen Block um seine Eigenschaften zu
									bearbeiten
								</p>
							</div>
						) : (
							<div className="properties-content">
								<div className="property-group">
									<label className="property-label">
										Name
									</label>
									<input
										type="text"
										className="property-input"
										value={selectedBlock.name}
										onChange={(e) =>
											handleUpdate("name", e.target.value)
										}
									/>
								</div>

								<div className="property-group">
									<label className="property-label">
										Aktiv
									</label>
									<input
										type="checkbox"
										className="property-checkbox"
										checked={selectedBlock.active}
										onChange={(e) =>
											onBlockUpdate(selectedBlock.id, {
												active: e.target.checked
											})
										}
									/>
								</div>

								{selectedBlock.type === "text" && (
									<TextPanel
										key={selectedBlock.id}
										selectedBlock={selectedBlock}
										onChange={(updates) =>
											onBlockUpdate(
												selectedBlock.id,
												updates
											)
										}
									/>
								)}

								{selectedBlock.type === "button" && (
									<ButtonPanel
										selectedBlock={selectedBlock}
										onChange={(
											key: string,
											value: string
										) => handleUpdate(key, value)}
									/>
								)}

								{selectedBlock.type === "image" && (
									<ImagePanel
										selectedBlock={selectedBlock}
										onChange={(
											key: string,
											value: string
										) => handleUpdate(key, value)}
									/>
								)}

								{selectedBlock.type === "layout" && (
									<LayoutPanel
										selectedBlock={selectedBlock}
										onChange={(
											key: string,
											value: string
										) => handleUpdate(key, value)}
									/>
								)}

								{selectedBlock.type === "section" &&
									multipleSections && (
										<SectionPanel
											selectedBlock={selectedBlock}
											onChange={(
												key: string,
												value: string
											) => handleUpdate(key, value)}
										/>
									)}

								{selectedBlock.type === "content" && (
									<ContentPanel
										selectedBlock={selectedBlock}
										onChange={(updates) =>
											onBlockUpdate(
												selectedBlock.id,
												updates
											)
										}
									/>
								)}

								{selectedBlock.type === "spacer" && (
									<SpacerPanel
										selectedBlock={selectedBlock}
										onChange={(
											key: string,
											value: string
										) => handleUpdate(key, value)}
									/>
								)}

								<div className="properties-section-divider">
									<h4>Stil</h4>
								</div>

								<StylePanel
									key={`style-${selectedBlock.id}`}
									selectedBlock={selectedBlock}
									onStyleChange={handleStyleChange}
								/>
							</div>
						)}
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	);
}
