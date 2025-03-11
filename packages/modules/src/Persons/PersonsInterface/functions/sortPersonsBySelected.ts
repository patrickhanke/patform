import { PersonClass } from '@repo/types';
import { cloneDeep } from 'lodash-es';

const sortPersonsBySelected = (persons: PersonClass[], selectedPersons: string[]): PersonClass[] => {
	const personsCopy = cloneDeep(persons);
	return personsCopy.sort((a, b) => {
		if (selectedPersons.includes(a.objectId) && selectedPersons.includes(b.objectId)) {
			return 0;
		} else if (selectedPersons.includes(a.objectId)) {
			return -1;
		} else {
			return 1;
		}
	});
};

export default sortPersonsBySelected;