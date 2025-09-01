import { TableColumnPersonsProps } from "../types";
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

const TableColumnPersons = ({
	value,
	isEditable,
	onChange
}: TableColumnPersonsProps) => {
	const { modules } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newPersons, setNewPersons] = useState<string[]>(value || []);

	const { data: personData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Person",
			fields: ["objectId", "label", "portrait "]
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

	const currentPersons: SelectElement[] = useMemo(() => {
		const elementData: SelectElement[] = newPersons.map((vl) =>
			elements.find((element) => element.id === vl)
		) as SelectElement[];
		return elementData || [];
	}, [elements, newPersons]);

	const selectPerson = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={currentPersons}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						setNewPersons([]);
					} else if (selectValue.length > 0) {
						setNewPersons(selectValue.map((value) => value.id));
					}
				}}
				max={6}
				isSearchable
			/>
		),
		[elements, value, currentPersons]
	);

	return (
		<div>
			{!value || value?.length === 0 ? (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="full_button sm grey"
					disabled={!isEditable}
				>
					<span>+ Person hinzufügen</span>
				</button>
			) : (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="full_button sm light"
					disabled={!isEditable}
				>
					<div className="person_display_container">
						{value && value.length < 5 && personData ? (
							value.map((person) => (
								<PersonDisplay
									key={person}
									person={personData.objects.findPerson.results.find(
										(ps: PersonClass) =>
											ps.objectId === person
									)}
									onlyImage={value.length > 1}
								/>
							))
						) : (
							<span>{value.length} Personen</span>
						)}
					</div>
				</button>
			)}
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					setLoading(true);
					await onChange(newPersons);
					setIsOpen(false);
					setLoading(false);
				}}
				disabled={[loading, loading]}
				header="Personen auswählen"
			>
				{selectPerson}
			</SlideIn>
		</div>
	);
};

export default TableColumnPersons;
