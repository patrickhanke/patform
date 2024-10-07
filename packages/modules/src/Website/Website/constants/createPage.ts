import { PageCreateClassObject } from '@repo/ui';

const createPage: () => PageCreateClassObject = () => ({
	className: 'Webpage',
	text: 'Neue Seite erstellen',
	initialData: {
		name: '',
		title: '',
		subtitle: ''
	},
	fields: [{
		id: 'name',
		position: 1,
		name: 'name',
		type: 'input',
		label: 'Name',
		validation: {required: 'Pflichtfeld'}
	},
	{
		id: 'title',
		position: 2,
		name: 'title',
		type: 'input',
		label: 'Titel'
	},
	{
		id: 'subtitle',
		position: 3,
		name: 'subtitle',
		type: 'textarea',
		label: 'Untertitel'
	}
	
	]});

export default createPage;