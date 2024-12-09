import { PageCreateClassObject } from '@repo/ui';

const createForm: PageCreateClassObject = {
	initialData: undefined,
	className: 'Form',
	text: 'Neues Formular erstellen',
	fields: [{
		id: 'name',
		position: 1,
		name: 'name',
		type: 'input',
		label: 'Name',
		validation: {required: 'Pflichtfeld', min_length: 5, max_length: 36}
	}]};

export default createForm;