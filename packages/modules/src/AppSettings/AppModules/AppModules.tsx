'use client';

import { useContext } from 'react'
import { AppContext, generateGraphQLQuery, paramsHandler } from '@repo/provider'
import { DnDDisplay, Page, sortItemsByPosition } from '@repo/ui'
import { Module } from '@repo/types'
import { useQuery } from '@apollo/client'
import AppModule from './content/AppModule';

const AppModules = () => {
    const {project} = useContext(AppContext)

    const {data, loading} = useQuery(generateGraphQLQuery(
        {
            type: 'find', 
            objectName: 'Module', 
            fields: ['objectId', 'name', 'createdAt', 'icon']
        }
    ), {
        variables: paramsHandler({filters: [{key: 'project', value: project.objectId as string, operator: '_eq', id: 'projectId'}]} )
    })

    if (loading) return null;

    const modules = data?.objects.findModule.results

  return (
    <Page 
        title='Module'
        pageHeaderContent={<p>Module</p>}
        pageHeaderButtons={[{text: 'Neue Person erstellen', onClick: () => console.log(true)}]}
        hasPageNavigation={true}
        emptyContent={true}
    >
        <DnDDisplay
            items={sortItemsByPosition(modules).map((module: Module) => ({...module, id: module.objectId})) || []}
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