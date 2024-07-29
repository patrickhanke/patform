'use client';

import { useContext, useMemo, useState } from 'react';
import { ColumnDef, IconButton, Modal, Page, Table, TableColumnImage }  from '@repo/ui';
import { PageState, Person } from '@repo/types';
import { AppContext, getDateStringsFromIso, getImageUrl, useDataHandler } from '@repo/provider';
import useFindPerson from './hooks/useFindPerson';
import deleteModalInitialValues from './constants/deleteModalInitialValues';
import EditPerson from './content/EditPerson';
import CreatePerson from './content/CreatePerson';

const pageStates: PageState[] = [
    {value: 'all', label: 'Alle'},
    {value: 'active', label: 'Aktiv'},
    {value: 'inactive', label: 'Inaktiv'},
]

const PersonsOverview = () => {
    const {currentModule} = useContext(AppContext)
    const [activeState, setActiveState] = useState(pageStates[0])
    const [filters, setFilters] = useState([])
    const {persons, refetch} = useFindPerson({moduleId: currentModule.objectId, filters})
    const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues)
    const {deleteData} = useDataHandler();

    const columns = useMemo(() => [
		{
			accessorFn: row => <TableColumnImage url={row.portrait} />,
			header: () => <span>Vorschau</span>,
			id: 'portrait',
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
            accessorKey: 'name',
			header: () => <span>Name</span>,
			id: 'name',
            cell: info => info.getValue(),
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
	] as ColumnDef<Person>[] , [persons]);

    console.log(persons);
    

  return (
    <Page 
        title='Athleten'
        pageHeaderContent={<CreatePerson refetch={refetch} />}
        hasPageNavigation={true}
        emptyContent={true}
        pageStates={pageStates}
        activeState={activeState}
        navOnClick={setActiveState}
    >
        <Table 
            columns={columns}
            data={persons || []}
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

export default PersonsOverview