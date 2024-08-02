'use client';

import { useContext, useMemo, useState } from 'react';
import { ColumnDef, IconButton, Modal, Page, Table, TableColumnImage, TableColumnString, TableColumnTextfield }  from '@repo/ui';
import { News, PageState } from '@repo/types';
import { AppContext, getDateStringsFromIso, useDataHandler } from '@repo/provider';
import deleteModalInitialValues from './constants/deleteModalInitialValues';
import EditNews from './content/EditNews';
import useFindNews from './hooks/useFindNews';
import CreateNews from './content/CreateNews';

const pageStates: PageState[] = [
    {value: 'all', label: 'Alle'},
    {value: 'active', label: 'Aktiv'},
    {value: 'inactive', label: 'Inaktiv'},
]

const NewsOverview = () => {
    const {currentModule} = useContext(AppContext)
    const [activeState, setActiveState] = useState(pageStates[0])
    const [filters, setFilters] = useState([])
    const {news, refetch} = useFindNews({moduleId: currentModule.objectId, filters})
    const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues)
    const {deleteData, updateData} = useDataHandler();

    const columns = useMemo(() => [
		{
			accessorFn: row => 
                <TableColumnImage 
                    url={row.image}  
                    isEditable={true}
                    onChange={async (image: string) => {
                        
                        await updateData({
                            className: 'News',
                            objectId: row.objectId,
                            updateObject: {portrait: image}
                        })
                        refetch();
                    }}
                />,
			header: () => <span>Vorschau</span>,
			id: 'image',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
        {
            accessorFn: row => 
                <TableColumnString
                    value={row.title}  
                    isEditable={true}
                    onChange={async (value: string) => {
                        await updateData({
                            className: 'News',
                            objectId: row.objectId,
                            updateObject: {title: value}
                        })
                        refetch();
                    }}
                />,
			header: () => <span>Titel</span>,
			id: 'title',
            cell: info => info.getValue(),
			footer: info => info.column.id
		},
        {
            accessorFn: row => 
                <TableColumnTextfield
                    key={row.objectId}
                    value={row.text}  
                    isEditable={true}
                    onChange={async (value: string) => {
                        await updateData({
                            className: 'News',
                            objectId: row.objectId,
                            updateObject: {text: value}
                        })
                        refetch();
                    }}
                />,
			header: () => <span>Text</span>,
			id: 'text',
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
                    <EditNews newsId={row.objectId} />
                    <IconButton
                        icon='delete'
                        onClick={() => setDeleteModal({
                            isOpen: true,
                            confirmButtonHandler: async () => {
                                await deleteData({
                                    className: 'News',
                                    objectId: row.objectId,
                                })
                                refetch();
                                setDeleteModal({...deleteModal, isOpen: false})
                            },
                            header: 'News löschen'
                        })}
                    />
                </div>,
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	] as ColumnDef<News>[] , [news]);

    console.log(news);
    

  return (
    <Page 
        title={currentModule.name}
        pageHeaderContent={<CreateNews refetch={refetch} />}
        hasPageNavigation={true}
        emptyContent={true}
        pageStates={pageStates}
        activeState={activeState}
        navOnClick={setActiveState}
    >
        <Table 
            columns={columns}
            data={news || []}
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
            <p>Sind sich Sicher, dass sie die News löschen möchten?</p>
        </Modal>
    </Page>
  )
}

export default NewsOverview;