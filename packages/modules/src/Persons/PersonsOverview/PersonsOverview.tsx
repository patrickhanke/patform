'use client';

import { useContext, useMemo, useState } from 'react';
import { ColumnDef, IconButton, Modal, Page, Table, TableColumnImage, TableColumnString, useCreateColumns }  from '@repo/ui';
import { PageState, PersonClass } from '@repo/types';
import { AppContext, getDateStringsFromIso, useDataHandler } from '@repo/provider';
import useFindPerson from './hooks/useFindPerson';
import deleteModalInitialValues from './constants/deleteModalInitialValues';
import CreatePerson from './content/CreatePerson';

const pageStates: PageState[] = [
    {value: 'all', label: 'Alle'},
    {value: 'active', label: 'Aktiv'},
    {value: 'inactive', label: 'Inaktiv'},
]

const PersonsOverview = () => {
    const {currentModule} = useContext(AppContext)
    const [activeState, setActiveState] = useState(pageStates[0])
    const [filters] = useState([])
    const {persons, refetch} = useFindPerson({moduleId: currentModule.objectId, filters})
    const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues)

    const columns = useCreateColumns<PersonClass>({
        data:[
            {id: 'portrait', type: 'edit_image', label: 'Portrait'},
            {id: 'name', type: 'edit_string', label: 'Name'},
        ],
        fields: currentModule.fields,
        className: 'Portrait',
        refetch,
        categories: currentModule?.categories
    })

  return (
    <Page 
        title={currentModule.name}
        pageHeaderContent={<CreatePerson refetch={refetch} />}
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