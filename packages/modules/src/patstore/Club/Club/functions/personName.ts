import { PersonClass } from "@repo/types";

export const personName = (person?: PersonClass | null) => {
	if (!person) {
		return "";
	}
	return (
		person.name ||
		person.label ||
		(person as { title?: string }).title ||
		person.email ||
		person.objectId
	);
};

export const personOptions = (people: PersonClass[]) =>
	people.map((person) => ({
		value: person.objectId,
		label: personName(person)
	}));
