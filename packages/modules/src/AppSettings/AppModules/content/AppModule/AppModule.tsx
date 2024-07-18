import React from 'react'
import { generateGraphQLQuery, paramsHandler } from '@repo/provider'
import { useQuery } from '@apollo/client'
import { Loader } from '@repo/ui'
import './styles.scss';
import AppModuleEditFields from './components/AppModuleEditFields';

const AppModule = ({id}: {id: string}) => {
    const {data, loading} = useQuery(generateGraphQLQuery(
        {
            type: 'get', 
            objectName: 'Module', 
            fields: ['objectId', 'name', 'createdAt', 'icon', 'path', 'settings', 'fields', 'name', 'position']
        }
    ), {
        variables: {id}
    })
    if (loading) return <Loader width='100%' height='30px' />

    const module = data?.objects.getModule

    return (
        <div className='app_module_container'>
            <h3>{module.name}</h3>
            <AppModuleEditFields fields={module.fields} />
        </div>
    )
}

export default AppModule