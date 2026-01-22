"use client";

import { FC, useContext, useMemo, useState } from "react";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { EmailClass } from "@repo/types";

interface EmailListSelectorProps {
	settings: EmailClass["settings"];
	updateSettings: (settings: EmailClass["settings"]) => Promise<void>;
	loading: boolean;
}

const EmailListSelector: FC<EmailListSelectorProps> = ({
	settings,
	updateSettings,
	loading
}) => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedListId, setSelectedListId] = useState<string | undefined>(
		settings.recipient_list
	);

	// Fetch all lists
	const { data: lists } = useFindData({
		objectName: "Item",
		fields: ["objectId", "title"],
		filters: [
			{
				key: "type",
				value: "list",
				operator: "equalTo",
				id: "type_filter"
			}
		],
		limit: 1000,
		skip: 0,
		order: "title_ASC",
		moduleId: currentModule.objectId
	});

	// Convert lists to SelectElement format
	const elements = useMemo(() => {
		const listOptionsArray: SelectElement[] = [];
		if (lists && lists.length > 0) {
			lists.forEach((list: { objectId: string; title: string }) => {
				listOptionsArray.push({
					value: list.objectId,
					id: list.objectId,
					label: list.title || "Unbenannte Liste"
				});
			});
		}
		listOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return listOptionsArray;
	}, [lists]);

	// Get selected list name
	const selectedListName = useMemo(() => {
		if (!selectedListId) return "Keine Liste ausgewählt";
		const list = elements.find((element) => element.id === selectedListId);
		return list?.label || "Unbekannte Liste";
	}, [selectedListId, elements]);

	const selectListInterface = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={elements.filter(
					(element) => selectedListId === element.id
				)}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						setSelectedListId(undefined);
					} else if (selectValue.length > 0) {
						setSelectedListId(selectValue[0]?.id);
					}
				}}
				max={1}
				isSearchable
				isClearable
			/>
		),
		[elements, selectedListId]
	);

	return (
		<>
			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col a-st">
					<label>Empfängerliste</label>
					<p>
						Wählen Sie eine vordefinierte Liste von Empfängern für
						diese E-Mail aus.
					</p>
					{selectedListId && (
						<p style={{ fontWeight: 600, marginTop: "0.5rem" }}>
							Ausgewählt: {selectedListName}
						</p>
					)}
				</div>
				<button
					className="full_button sm light"
					onClick={() => setIsOpen(true)}
					type="button"
					disabled={loading}
				>
					<span>Liste auswählen</span>
				</button>
			</div>

			<SlideIn
				isOpen={isOpen}
				cancel={() => {
					setIsOpen(false);
					setSelectedListId(settings.recipient_list);
				}}
				confirm={async () => {
					await updateSettings({
						...settings,
						recipient_list: selectedListId
					});
					setIsOpen(false);
				}}
				disabled={[loading, loading]}
				header="Empfängerliste auswählen"
			>
				{selectListInterface}
			</SlideIn>
		</>
	);
};

export default EmailListSelector;
