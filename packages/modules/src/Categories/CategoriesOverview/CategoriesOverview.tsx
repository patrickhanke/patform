'use client';

import { useContext, useMemo, useState } from 'react';
import { ColumnDef, IconButton, Modal, Page, Table, TableColumnImage, TableColumnString }  from '@repo/ui';
import { Category, PageState, Person } from '@repo/types';
import { AppContext, getDateStringsFromIso, useDataHandler } from '@repo/provider';
import deleteModalInitialValues from './constants/deleteModalInitialValues';
import EditPerson from './content/EditPerson';
import CreateCategory from './content/CreateCategory';
import useFindCategory from './hooks/useFindCategory';

const Categories = () => {
  const {currentModule} = useContext(AppContext)
  const pageStates  = useMemo(() =>( currentModule?.settings?.categories), [currentModule])
  const [activeState, setActiveState] = useState(pageStates[0])
  const {categories, refetch} = useFindCategory({moduleId: currentModule.objectId, filters: activeState.value ?  [{key: 'type', value: activeState.value, operator: '_eq', id: activeState.id}] : []}) 
  const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues)
  const {deleteData, updateData} = useDataHandler();

  const columns = useMemo(() => [
		{
			accessorFn: row => 
                <TableColumnImage 
                    url={row.image}  
                    isEditable={true}
                    onChange={async (image: string) => {
                        console.log(image);
                        
                        await updateData({
                            className: 'Person',
                            objectId: row.objectId,
                            updateObject: {portrait: image}
                        })
                        refetch();
                    }}
                />,
			header: () => <span>Vorschau</span>,
			id: 'portrait',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
        {
            accessorFn: row => 
                <TableColumnString
                    value={row.name}  
                    isEditable={true}
                    onChange={async (value: string) => {
                        await updateData({
                            className: 'Person',
                            objectId: row.objectId,
                            updateObject: {name: value}
                        })
                        refetch();
                    }}
                />,
			header: () => <span>Name</span>,
			id: 'name',
            cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorKey: 'createdAt',
			header: () => <span>Erstellt</span>,
			id: 'erstellt',
            cell: info => getDateStringsFromIso(info.getValue() as string).datumUhrzeit,
			footer: info => info.column.id
		},
		{
			accessorFn: row => 
				<div className='button_container'>
                    <EditPerson personId={row.objectId} />
                    <IconButton
                        icon='download'
                        isBlank
                        isLink
                        link ={'row.file.url'}
                    />
                    <IconButton
                        icon='delete'
                        onClick={() => setDeleteModal({
                            isOpen: true,
                            confirmButtonHandler: async () => {
                                await deleteData({
                                    className: 'Person',
                                    objectId: row.objectId,
                                })
                                refetch();
                                setDeleteModal({...deleteModal, isOpen: false})
                            },
                            header: 'Person löschen'
                        })}
                    />
                </div>,
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	] as ColumnDef<Category>[] , [categories]);

  return (
    <Page 
        title={currentModule.name}
        pageHeaderContent={<CreateCategory refetch={refetch} typeValue={activeState.value} />}
        hasPageNavigation={true}
        emptyContent={true}
        pageStates={pageStates}
        activeState={activeState}
        navOnClick={setActiveState}
    >
        <Table 
            columns={columns}
            data={categories || []}
        />
        <Modal 
            isOpen={deleteModal.isOpen}
            cancelButtonHandler={() => setDeleteModal(deleteModalInitialValues)}
            confirmButtonHandler={() => {
                deleteModal.confirmButtonHandler()
                setDeleteModal(deleteModalInitialValues)
            }}
            header={deleteModal.header}
        >
            <p>Sind sich Sicher, dass sie die Person löschen möchten?</p>
        </Modal>
    </Page>
  )
}

export default Categories