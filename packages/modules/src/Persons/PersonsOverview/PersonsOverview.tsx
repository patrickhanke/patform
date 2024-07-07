'use client';

import { useContext, useMemo, useState } from 'react';
import {ColumnDef, IconButton, Modal, Page, Table}  from '@repo/ui';
import { PageState, Person } from '@repo/types';
import { AppContext, getDateStringsFromIso, getImageUrl, useDataHandler } from '@repo/provider';
import useFindPerson from './hooks/useFindPerson';
import deleteModalInitialValues from './constants/deleteModalInitialValues';

const pageStates: PageState[] = [
    {value: 'all', label: 'Alle'},
    {value: 'active', label: 'Aktiv'},
    {value: 'inactive', label: 'Inaktiv'},
]

const PersonsOverview = () => {
    const {project} = useContext(AppContext)
    const [createPerson, setCreatePerson] = useState(false)
    const [newPerson, setNewPerson] = useState<string[]>([]);
    const [activeState, setActiveState] = useState(pageStates[0])
    const [filters, setFilters] = useState([])
    const {persons, refetch} = useFindPerson({projectId: project.objectId, filters})
    const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues)
    const {deleteData} = useDataHandler();
    const [editImage, setEditImage] = useState({open: false, person: '', newImage: undefined as unknown as Person | undefined})

    const columns = useMemo(() => [
		{
			accessorFn: row => {row.portrait ? <img src={getImageUrl({filePath: row.portrait})} /> : '-'},
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
                    <IconButton
                        icon='edit'
                        onClick={() => setEditImage({open: true, person: row.objectId, newImage: undefined})}
                    />
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
        title='Personsn'
        pageHeaderContent={<p>Personen</p>}
        pageHeaderButtons={[{text: 'Neue Person erstellen', onClick: () => setCreatePerson(true)}]}
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
            isOpen={createPerson}
            buttonDisabled={[!!newPerson, false]}
            cancelButtonHandler={() => setCreatePerson(false)}
            confirmButtonHandler={async () =>{ 
                setCreatePerson(false)
            }}
            header='Upload Images'
        >
            <div>
                <p>
                    Personen erstellen
                </p>
            </div>
        </Modal>
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
        <Modal 
            isOpen={editImage.open}
            cancelButtonHandler={() => setEditImage({open: false, person: '', newImage: undefined})}
            confirmButtonHandler={() => {
                setEditImage({open: false, person: '', newImage: undefined})
            }}
            header='Person bearbeiten'
        >
            <div>
                <p>
                    Person bearbeiten
                </p>
            </div>
        </Modal>
    </Page>
  )
}

export default PersonsOverview