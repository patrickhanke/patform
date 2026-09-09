"use client";

import { FC, useContext, useMemo, useState } from "react";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { EmailListSelectorProps } from "../types";
import { resolveRecipientListId } from "../../../functions/resolveRecipientListId";

const EmailListSelector: FC<EmailListSelectorProps> = ({
	settings,
	updateSettings
}) => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedListId, setSelectedListId] = useState<string | undefined>(
		resolveRecipientListId(settings.recipient_list)
	);

	const { data: lists } = useFindData({
		objectName: "Email",
		fields: ["objectId", "title"],
		filters: [
			{
				key: "type",
				value: ["list", "static_list"],
				operator: "in"
			}
		],
		limit: 1000,
		skip: 0,
		order: "title_ASC",
		moduleId: currentModule.objectId
	});

	console.log(lists);
	console.log(currentModule);

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
				>
					<span>Liste auswählen</span>
				</button>
			</div>

			<SlideIn
				isOpen={isOpen}
				cancel={() => {
					setIsOpen(false);
					setSelectedListId(
						resolveRecipientListId(settings.recipient_list)
					);
				}}
				confirm={async () => {
					await updateSettings({
						...settings,
						recipient_list: selectedListId
					});
					setIsOpen(false);
				}}
				header="Empfängerliste auswählen"
			>
				{selectListInterface}
			</SlideIn>
		</>
	);
};

export default EmailListSelector;
