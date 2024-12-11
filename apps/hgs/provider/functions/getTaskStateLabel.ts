import { TaskTypes } from '@types';

const getTaskStateLabel = (state: TaskTypes.TaskState) => {
	if (state === 'completed' ) {
		return 'Abgeschlossen';
	}
	if (state === 'executed') {
		return 'Ausgeführt';
	}
	if (state === 'created') {
		return 'Erstellt';
	}
	if (state === 'assigned') {
		return 'Zugewiesen';
	}
	return null;
};

export default getTaskStateLabel;