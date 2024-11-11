import { PageCreateClassObject } from '@repo/ui';

const createDownload: PageCreateClassObject = {
	initialData: undefined,
	className: 'Download',
	text: 'Neuen Download erstellen',
	fields: [{
		id: 'title',
		position: 1,
		name: 'title',
		type: 'input',
		label: 'Titel',
		validation: {required: 'Pflichtfeld', min_length: 5, max_length: 36}
	},
	{
		id: 'file',
		position: 2,
		name: 'file',
		type: 'file',
		label: 'Datei',
		validation: {required: 'Pflichtfeld'}
	},
	{
		id: 'info',
		position: 3,
		name: 'info',
		type: 'textarea',
		label: 'Infotext',
		validation: {
			max_length: 180
		}
	}]};

export default createDownload;