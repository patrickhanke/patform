"use client";

import { FC } from "react";
import { ElementSelectInterface, SelectElement } from "@repo/ui";
import { PersonClass } from "@repo/types";
import { useAppContext, useFindData } from "@repo/provider";

export const refereeClassIds = (value: unknown): string[] => {
	if (Array.isArray(value)) {
		return value.filter(
			(item): item is string => typeof item === "string" && item !== ""
		);
	}
	if (typeof value === "string" && value) return [value];
	return [];
};

const personLabel = (person: PersonClass) =>
	person.name || person.label || person.objectId;

const Referees: FC<{
	selectedIds: string[];
	refereeClass: unknown;
	onChange: (ids: string[]) => void;
	onOpen: () => void;
	mode?: "summary" | "select";
}> = ({
	selectedIds,
	refereeClass,
	onChange,
	onOpen,
	mode = "summary"
}) => {
	const { project } = useAppContext<"patstore">();
	const classIds = refereeClassIds(refereeClass);
	const { data } = useFindData<PersonClass>({
		objectName: "Person",
		fields: ["objectId", "name", "label", "categories"],
		projectId: project?.objectId,
		limit: 1000,
		skipQuery: !project?.objectId || classIds.length === 0
	});
	const people = (data || []) as PersonClass[];
	const eligible = people.filter((person) =>
		classIds.some((id) => (person.categories || []).includes(id))
	);
	const elements: SelectElement[] = eligible.map((person) => ({
		value: person.objectId,
		id: person.objectId,
		label: personLabel(person),
		selected: selectedIds.includes(person.objectId)
	}));

	if (mode === "select") {
		if (classIds.length === 0) {
			return (
				<p>
					Dieser Wettkampf hat keine Schiedsrichterklasse angegeben.
				</p>
			);
		}
		return (
			<div className="flex col a-st gap-sm">
				<h3>Schiedsrichter</h3>
				<ElementSelectInterface
					elements={elements}
					selectedElements={elements.filter((item) =>
						selectedIds.includes(String(item.value))
					)}
					onSelect={(selected) =>
						onChange(selected.map((item) => String(item.value)))
					}
					isSearchable
					title="Schiedsrichter"
				/>
			</div>
		);
	}

	const selected = selectedIds
		.map((id) => people.find((person) => person.objectId === id))
		.filter((person): person is PersonClass => Boolean(person));

	return (
		<div className="flex col a-st gap-sm">
			<h3>Schiedsrichter</h3>
			{classIds.length === 0 ? (
				<p>
					Dieser Wettkampf hat keine Schiedsrichterklasse angegeben.
				</p>
			) : (
				<>
					<div className="flex col a-st gap-xs">
						{selected.map((person) => (
							<span key={person.objectId}>
								{personLabel(person)}
							</span>
						))}
					</div>
					<button
						type="button"
						className="full_button sm secondary"
						onClick={onOpen}
					>
						Schiedsrichter auswählen
					</button>
				</>
			)}
		</div>
	);
};

export default Referees;
