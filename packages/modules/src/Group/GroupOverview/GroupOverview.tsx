'use client';

import { useContext, useState } from 'react';
import { Modal, Page, Table, useCreateColumns } from '@repo/ui';
import { AppContext } from '@repo/provider';
import { GroupClass } from '@repo/types';
import useFindGroup from './hooks/useFindGroup';
import createGroup from './constants/createGroup';

const GroupOverview = () => {
	const {currentModule} = useContext(AppContext);

	const [filters] = useState([]);
	const {groups, refetch} = useFindGroup({moduleId: currentModule.objectId, filters});
	const [deleteModal, setDeleteModal] = useState();

	const columns = useCreateColumns<GroupClass>({
		data:[
			{id: 'image', type: 'edit_image', label: 'Portrait'},
			{id: 'title', type: 'edit_string', label: 'Name'},
			{id: 'description', type: 'edit_string', label: 'Beschreibung'},
			{id: 'state', type: 'edit_string', label: 'Status'},
			{id: 'contact', type: 'edit_string', label: 'Kontakt'},
			{id: 'info', type: 'edit_string', label: 'Info'}
		],
		fields: currentModule.fields,
		className: 'Group',
		refetch,
		categories: currentModule?.categories
	});

	return (
		<Page 
			title={currentModule.name}
			emptyContent={true}
			createClass={createGroup}
			refetch={refetch}
		>
			<Table 
				columns={columns}
				data={groups || []}
			/>
			{/* <Modal 
				isOpen={deleteModal.isOpen}
				cancelButtonHandler={() => setDeleteModal(deleteModalInitialValues)}
				confirmButtonHandler={() => {
					deleteModal.confirmButtonHandler();
					setDeleteModal(deleteModalInitialValues);
				}}
				header={deleteModal.header}
			>
				<p>Sind sich Sicher, dass sie die Person löschen möchten?</p>
			</Modal> */}
		</Page>
	);
};

export default GroupOverview;