import { TableColumnPersonProps } from "../types";
import {
	ElementSelectInterface,
	PersonDisplay,
	SelectElement,
	SlideIn
} from "@repo/ui";
import { useContext, useMemo, useState } from "react";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { PersonClass } from "@repo/types";

const TableColumnPerson = ({
	value,
	isEditable,
	onChange
}: TableColumnPersonProps) => {
	const { modules } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState<string | undefined>(
		value?.objectId
	);

	const { data: personData } = useFindData({
		objectName: "Person",
		fields: ["objectId", "label", "portrait"],
		moduleId: modules.find((module) => module.path === "/persons")?.objectId
	});

	const elements = useMemo(() => {
		const personOptionsArray: SelectElement[] = [];
		if (personData) {
			personData.forEach((person: PersonClass) => {
				if (person) {
					personOptionsArray.push({
						value: person.objectId,
						id: person.objectId,
						label: `${person.label}`,
						element: <PersonDisplay person={person} />
					});
				}
			});
		}
		personOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return personOptionsArray;
	}, [personData]);

	const currentPerson: SelectElement | undefined = useMemo(() => {
		return elements.find((element) => element.id === value?.objectId);
	}, [elements, value]);

	const selectPerson = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={currentPerson ? [currentPerson] : []}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						setSelectedPerson("");
					} else if (selectValue.length > 0) {
						setSelectedPerson((selectValue[0]?.id as string) || "");
					}
				}}
				max={1}
				isSearchable
			/>
		),
		[elements, value, currentPerson]
	);

	if (!isEditable) {
		return (
			<div>
				{value ? (
					<PersonDisplay person={value} onlyImage={false} />
				) : (
					<span>-</span>
				)}
			</div>
		);
	}

	return (
		<div>
			<button
				className={"full_button sm light"}
				onClick={() => {
					if (isEditable) {
						setIsOpen(true);
					}
				}}
			>
				<div>
					{currentPerson ? (
						<PersonDisplay person={value} onlyImage={false} />
					) : (
						<span>+ Person hinzufügen</span>
					)}
				</div>
			</button>
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					if (selectedPerson) {
						setLoading(true);
						if (onChange) {
							await onChange(selectedPerson);
						}
						setIsOpen(false);
						setLoading(false);
					}
				}}
				disabled={[loading, loading || !selectedPerson]}
				header="Personen auswählen"
			>
				{selectPerson}
			</SlideIn>
		</div>
	);
};

export default TableColumnPerson;
