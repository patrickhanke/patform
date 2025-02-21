import { useQuery } from '@apollo/client'
import { generateGraphQLQuery } from '@provider'
import { WorkerSelectWithState } from 'content/_UI'
import React from 'react'

const Tours = ({projectId}: {projectId: string}) => {
    const {data} = useQuery(generateGraphQLQuery({
        type: 'find' ,
        objectName: '_User',
        fields: ['objectId', 'first_name', 'family_name', 'is_worker', 'portrait', 'color', 'time_settings', 'role', 'createdAt']
    }), {
        variables: {is_worker: {_eq: true}, project: {_eq: projectId }}
    })

    console.log(data);
    

    return (
        <div>
            <p>Touren</p>
        </div>
    )
}

export default Tours