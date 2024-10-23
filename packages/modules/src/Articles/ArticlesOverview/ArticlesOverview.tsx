'use client';

import { useContext, useState } from 'react';
import { Modal, Page, Table, useCreateColumns } from '@repo/ui';
import { AppContext, generateGraphQLQuery } from '@repo/provider';
import deleteModalInitialValues from './constants/deleteModalInitialValues';
import useFindArticles from './hooks/useFindArticles';
import { ArticleClass, PersonClass } from '@repo/types';
import createArticle from './constants/createArticle';
import { useQuery } from '@apollo/client';
import state from './constants/articleState';

const ArticlesOverview = () => {
	const {currentModule, modules} = useContext(AppContext);
	const [filters] = useState([]);
	const {articles, refetch} = useFindArticles({moduleId: currentModule.objectId, filters}); 
	const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);
	const {data: personData} = useQuery(generateGraphQLQuery({type: 'find', objectName: 'Person', fields: ['objectId', 'label']}), {variables: {params: {module: {_eq:  modules.find(module => module.name === 'Person')?.objectId}}}});

	const columns = useCreateColumns<ArticleClass>({
		data:[
			{id: 'image', type: 'edit_image', label: 'Bild'},
			{id: 'title', type: 'edit_string', label: 'Titel'},
			{id: 'text', type: 'texteditor', label: 'Text'},
			{id: 'state', type: 'edit_state', label: 'Status'},
			{id: 'gallery', type: 'gallery', label: 'Galerie'},
			{id: 'author', type: 'person', label: 'Autor'}
		],
		fields: currentModule.fields,
		className: 'Article',
		refetch,
		categories: currentModule?.categories,
		constants: {state}
	});
	
	return (
		<Page 
			title={currentModule.name}
			emptyContent={true}
			createClass={createArticle(personData?.objects.findPerson.results.map((person: PersonClass) => ({value: person.objectId, label: person.label})) || [])}
			refetch={refetch}
		>
			<Table 
				columns={columns}
				data={articles || []}
			/>
			<Modal 
				isOpen={deleteModal.isOpen}
				cancelButtonHandler={() => setDeleteModal(deleteModalInitialValues)}
				confirmButtonHandler={() => {
					deleteModal.confirmButtonHandler();
					setDeleteModal(deleteModalInitialValues);
				}}
				header={deleteModal.header}
			>
				<p>Sind sich Sicher, dass sie den Bericht löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default ArticlesOverview;