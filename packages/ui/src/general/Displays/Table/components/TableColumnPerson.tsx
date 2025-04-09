import { TableColumnPersonProps } from "../types";
import {
	ElementSelectInterface,
	PersonDisplay,
	SelectElement,
	SlideIn
} from "@repo/ui";
import { useContext, useMemo, useState } from "react";
import { PatstoreAppContext, generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
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
		value.objectId
	);

	const { data: personData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Person",
			fields: ["objectId", "label", "portrait"]
		}),
		{
			variables: {
				params: {
					module: {
						_eq: modules.find(
							(module) => module.path === "/persons"
						)?.objectId
					}
				}
			}
		}
	);

	const elements = useMemo(() => {
		const personOptionsArray: SelectElement[] = [];
		if (personData) {
			personData.objects.findPerson.results.forEach(
				(person: PersonClass) => {
					if (person) {
						personOptionsArray.push({
							value: person.objectId,
							id: person.objectId,
							label: `${person.label}`,
							element: <PersonDisplay person={person} />
						});
					}
				}
			);
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
					console.log(selectValue);

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
				{/* <IoPersonCircleOutline size={24} color={'#efefef'} /> */}
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
						await onChange(selectedPerson);
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
