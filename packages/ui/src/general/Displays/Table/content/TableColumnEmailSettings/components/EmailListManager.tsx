"use client";

import { FC, useMemo } from "react";
import { ElementSelectInterface, SelectElement } from "@repo/ui";
import { Divider } from "../../../../../Layout";

interface EmailListManagerProps {
	email: string;
	currentLists: string[];
	projectLists: { objectId: string; title: string }[];
	listsLoading: boolean;
	onListsChange: (lists: string[]) => void;
	onClose: () => void;
}

const EmailListManager: FC<EmailListManagerProps> = ({
	email,
	currentLists,
	projectLists,
	listsLoading,
	onListsChange,
	onClose
}) => {
	// Convert lists to SelectElement format
	const elements = useMemo(() => {
		const listOptionsArray: SelectElement[] = [];
		if (projectLists && projectLists.length > 0) {
			projectLists.forEach((list: { objectId: string; title: string }) => {
				listOptionsArray.push({
					value: list.objectId,
					id: list.objectId,
					label: list.title || "Unbenannte Liste"
				});
			});
		}
		listOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return listOptionsArray;
	}, [projectLists]);

	// Get selected elements
	const selectedElements = useMemo(() => {
		return elements.filter((element) => currentLists.includes(element.id));
	}, [elements, currentLists]);

	return (
		<div className="flex col gap-md" style={{ padding: "1rem" }}>
			<div className="flex row a-ce j-sb">
				<div className="flex col gap-xs">
					<h4>Listen verwalten</h4>
					<p style={{ fontSize: "0.85rem", color: "#666" }}>
						{email}
					</p>
					<p style={{ fontSize: "0.75rem", color: "#999", fontStyle: "italic" }}>
						Nur Listen des aktuellen Projekts werden angezeigt
					</p>
				</div>
			</div>

			<Divider showLine size="small" />

			{listsLoading ? (
				<p style={{ textAlign: "center", color: "#666" }}>Lädt...</p>
			) : (
				<ElementSelectInterface
					title="Verfügbare Listen"
					elements={elements}
					selectedElements={selectedElements}
					onSelect={(selectedItems) => {
						const selectedIds = selectedItems.map(
							(item) => item.id
						);
						onListsChange(selectedIds);
					}}
					max={999}
					isSearchable
					isClearable
					setSelectedToTop
				/>
			)}

			<Divider showLine size="small" />

			<div className="flex row gap-sm">
				<button
					className="full_button md light"
					onClick={onClose}
					type="button"
				>
					<span>Zurück</span>
				</button>
			</div>
		</div>
	);
};

export default EmailListManager;
