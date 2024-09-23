import { Field } from '@repo/ui';
const settings_fields: Field[] =  [{
	id: 'username',
	position: 1,
	name: 'username',
	type: 'input',
	label: 'Name',
	validation: {required: 'Pflichtfeld', min_length: 5, max_length: 36}
}];

export default settings_fields;