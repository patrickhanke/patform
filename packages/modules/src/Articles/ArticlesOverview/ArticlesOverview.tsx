'use client';

import { useContext, useState } from 'react';
import { Modal, Page, Table, useCreateColumns } from '@repo/ui';
import { AppContext } from '@repo/provider';
import deleteModalInitialValues from './constants/deleteModalInitialValues';
import useFindArticles from './hooks/useFindArticles';
import { ArticleClass } from '@repo/types';
import createArticle from './constants/createArticle';

const ArticlesOverview = () => {
	const {currentModule} = useContext(AppContext);
	const [filters] = useState([]);
	const {articles, refetch} = useFindArticles({moduleId: currentModule.objectId, filters}); 
	const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);
	
	const columns = useCreateColumns<ArticleClass>({
		data:[
			{id: 'image', type: 'edit_image', label: 'Bild'},
			{id: 'title', type: 'edit_string', label: 'Titel'},
			{id: 'text', type: 'edit_textfield', label: 'Text'}
			// {id: 'date', type: 'edit_date', label: 'Termine'}
		],
		fields: currentModule.fields,
		className: 'Article',
		refetch,
		categories: currentModule?.categories
	});
    
	return (
		<Page 
			title={currentModule.name}
			emptyContent={true}
			createClass={createArticle}
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