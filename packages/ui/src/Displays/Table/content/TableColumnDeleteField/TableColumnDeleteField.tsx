'use client';

import { useCallback, useState } from 'react';
import { useDataHandler } from '@repo/provider';
import { IconButton, Modal } from '@repo/ui';
import { TableColumnDeleteFieldComponent, TableColumnDeleteFieldProps } from './types';

const TableColumnDeleteField: TableColumnDeleteFieldComponent = ({objectId, className, refetch} : TableColumnDeleteFieldProps) => {
	const [deleteModal, setDeleteModal] = useState(false);
	const {deleteData} = useDataHandler();

	const deleteItem = useCallback(async () => {
		await deleteData({
			className,
			objectId
		});
		refetch();
		setDeleteModal(false);
	}, [objectId, className, refetch]);

	return (
		<div>
			<IconButton
				icon='delete'
				onClick={() => setDeleteModal(true)}
			/>
			<Modal 
				isOpen={deleteModal}
				cancelButtonHandler={() => setDeleteModal(false)}
				confirmButtonHandler={() => {
					setDeleteModal(false);
					deleteItem();
				}}
				header={'Eintrag löschen'}
			>
				<p>Sind sich Sicher, dass sie diesen Eintrag löschen möchten?</p>
			</Modal>
		</div>
	);
};

export default TableColumnDeleteField;