import { TableColumnPersonsProps } from "../types";
import {
	ElementSelectInterface,
	PersonDisplay,
	SelectElement,
	SlideInRight
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

	const currentPersons: SelectElement[] = useMemo(() => {
		const elementData: SelectElement[] = value.map((vl) =>
			elements.find((element) => element.id === vl)
		) as SelectElement[];
		return elementData || [];
	}, [elements, value]);

	const selectPerson = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={currentPersons}
				onSelect={(selectValue) => {
					console.log(selectValue);

					if (!selectValue || selectValue.length === 0) {
						onChange([]);
					} else if (selectValue.length > 0) {
						onChange(selectValue.map((value) => value.id));
					}
				}}
				max={6}
				isSearchable
			/>
		),
		[elements, value]
	);

	return (
		<div>
			{!value || value?.length === 0 ? (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="full_button sm grey"
				>
					<span>+ Person hinzufügen</span>
				</button>
			) : (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="full_button sm light"
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
			<SlideInRight
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				header="Person auswählen"
			>
				{selectPerson}
			</SlideInRight>
		</div>
	);
};

export default TableColumnPersons;
