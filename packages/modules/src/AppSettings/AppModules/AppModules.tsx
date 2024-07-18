'use client';

import { useContext } from 'react'
import { AppContext, generateGraphQLQuery, paramsHandler, sortModuleByPosition } from '@repo/provider'
import { DnDDisplay, DnDItem, Page } from '@repo/ui'
import { Module } from '@repo/types'
import { useQuery } from '@apollo/client'
import AppModule from './content/AppModule';

const AppModules = () => {
    const {project} = useContext(AppContext)

    const {data, loading} = useQuery(generateGraphQLQuery(
        {
            type: 'find', 
            objectName: 'Module', 
            fields: ['objectId', 'name', 'createdAt', 'icon', 'path', 'settings', 'fields', 'name', 'position']
        }
    ), {
        variables: paramsHandler({filters: [{key: 'project', value: project.objectId as string, operator: '_eq', id: 'projectId'}]} )
    })

  return (
    <Page 
        title='Persons'
        pageHeaderContent={<p>Personen</p>}
        pageHeaderButtons={[{text: 'Neue Person erstellen', onClick: () => console.log(true)}]}
        hasPageNavigation={true}
        emptyContent={true}
    >
        <DnDDisplay
            items={sortModuleByPosition(data?.objects.findModule.results).map((module: Module) => ({...module, id: module.objectId})) || []}
            ItemComponent={({item}) => (<AppModule id={item.id} />)}
            objectClass='Module'
            
        />
        {/* <Modal 
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
        </Modal> */}
       
    </Page>
  )
}

export default AppModules