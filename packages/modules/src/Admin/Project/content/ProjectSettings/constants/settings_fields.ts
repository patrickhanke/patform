import { Field } from '@repo/ui';
const settings_fields: Field[] =  [{
	id: 'name',
	position: 1,
	name: 'name',
	type: 'input',
	label: 'Name',
	validation: {required: 'Pflichtfeld', min_length: 5, max_length: 36}
}, {
	id: 'logo',
	position: 1,
	name: 'logo',
	type: 'image',
	label: 'Logo',
	options: {max_file_count: 1, return_type: 'string'}
}];

export default settings_fields;