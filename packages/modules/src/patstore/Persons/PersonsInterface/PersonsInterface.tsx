"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PersonsInterfaceComponent } from "./types";
import { Filter, PersonClass } from "@repo/types";
import "./styles.scss";
import { PatstoreAppContext } from "@repo/provider";
import useFindPerson from "./hooks/useFindPerson";
import DisplayPersonsInterface from "./components/DisplayPersonInterface";
import { PersonDisplay, SlideIn } from "@repo/ui";
import { cloneDeep } from "lodash-es";
import sortPersonsBySelected from "./functions/sortPersonsBySelected";

const PersonsInterface = ({
	persons,
	onChange,
	nextDate
}: PersonsInterfaceComponent) => {
	const { modules } = useContext(PatstoreAppContext);
	const [filter, setFilter] = useState<Filter[]>([]);
	const { persons: personData, filteredData } = useFindPerson({
		moduleId: modules.find((module) => module.path === "/persons")
			?.objectId,
		filters: filter
	});
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPersons, setSelectedPersons] = useState<string[]>(persons);

	const changeHandler = useCallback(
		(type: "add" | "remove", id: string) => {
			const valueCopy = cloneDeep(selectedPersons);
			if (type === "add") {
				setSelectedPersons([...valueCopy, id]);
			} else {
				setSelectedPersons(
					valueCopy.filter((personId) => personId !== id)
				);
			}
		},
		[persons, selectedPersons]
	);

	const displayPersons = useMemo(() => {
		const dataToUse =
			filter.length > 0 && filteredData ? filteredData : personData;
		const sortedPersons = sortPersonsBySelected(dataToUse, persons);
		const sortedPersonsWithSelected = sortedPersons.map((ps) => ({
			...ps,
			isSelected: selectedPersons.includes(ps.objectId)
		}));
		return sortedPersonsWithSelected;
	}, [personData, persons, filteredData, filter]);

	useEffect(() => {
		setSelectedPersons(persons);
	}, [persons]);

	return (
		<div>
			{!persons || persons?.length === 0 ? (
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
						{persons && persons.length < 5 ? (
							persons.map((person) => (
								<PersonDisplay
									key={person}
									person={personData.find(
										(ps: PersonClass) =>
											ps.objectId === person
									)}
									onlyImage={persons.length > 1}
								/>
							))
						) : (
							<span>{persons.length} Personen</span>
						)}
					</div>
				</button>
			)}

			<SlideIn
				isOpen={isOpen}
				cancel={() => {
					setFilter([]);
					setIsOpen(false);
				}}
				confirm={() => {
					onChange(selectedPersons);
					setFilter([]);
					setIsOpen(false);
				}}
				header="Personen auswählen"
			>
				<div>
					<input
						type="text"
						placeholder="Suche"
						onChange={(e) => {
							const value = e.target.value;
							if (value.length < 3) {
								setFilter([]);
								return;
							}
							// setSearchValue(value);
							setFilter([
								{
									key: "label",
									value: value,
									operator: "_regex",
									id: "label"
								}
							]);
						}}
					/>
				</div>
				<div className="person_interface_container">
					{displayPersons.map((person: PersonClass) => (
						<DisplayPersonsInterface
							key={person.objectId}
							person={person}
							isSelected={selectedPersons.includes(
								person.objectId
							)}
							onChange={changeHandler}
							nextDate={nextDate}
						/>
					))}
				</div>
			</SlideIn>
		</div>
	);
};

export default PersonsInterface;
