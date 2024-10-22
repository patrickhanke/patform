import { CreateClassProps } from '@repo/ui';
import { ArticleClass } from '@repo/types';

const createArticle = (persons: {value: string, label: string}[] ): CreateClassProps<ArticleClass> => ({
	initialData: {
		state: 'draft'
	},
	className: 'Article',
	text: 'Bericht erstellen',
	fields: [{
		id: 'title',
		position: 1,
		name: 'title',
		type: 'input',
		label: 'Titel',
		validation: {required: 'Pflichtfeld', min_length: 5, max_length: 36}
	},
	{
		id: 'image',
		position: 2,
		name: 'image',
		type: 'image',
		label: 'Bild',
		options: {
			return_type: 'string',
			max_file_count: 1
		},
		validation: {
			required: 'Pflichtfeld'
		}
	}, 
	{
		id: 'text',
		position: 3,
		name: 'text',
		type: 'texteditor',
		label: 'Text',
		placeholder: 'Text des Artikels',
		validation: {
			required: 'Pflichtfeld'
		}
	}, 
	{
		id: 'author',
		position: 4,
		name: 'author',
		type: 'pointer_select',
		label: 'Autor',
		placeholder: 'Autor*in',
		options: {
			pointer_class: 'Person' 
		},
		select_options: persons
	} ]
} );

export default createArticle;