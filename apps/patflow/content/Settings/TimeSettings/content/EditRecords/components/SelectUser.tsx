import { ElementSelectInterface, PersonDisplay } from '@repo/ui'
import { Worker } from '@types'
import React, { FC, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { FIND_ALL_STAFF } from '@queries'
import { SelectUserProps } from '../types'

const SelectUser: FC<SelectUserProps> = ({selectedUser, setSelectedUser}) => {
    const { loading, error, data } = useQuery(FIND_ALL_STAFF)

    const elements = useMemo(() => {
        const users: Worker[] = data?.objects.find_User.results
        
        if (users) {
            return users.map((user: Worker) => ({
                value: user.objectId,
                label: `${user.first_name} ${user.family_name}`,
                user: user,
                element: <PersonDisplay person={{
                    label: `${user.first_name} ${user.family_name}`,
                    portrait: user.portrait,
                }} 
                />
            }))
        }
        return []
    }, [data, selectedUser])

    const selectedElement = useMemo(() => {
        if (selectedUser && elements) {
            const el =  elements.find(element => element.value === selectedUser.objectId)
            return [el]
        }
        return []
    }, [selectedUser, elements])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    console.log(selectedElement);
    

    return (
        <div>
            <ElementSelectInterface
                elements={elements}          
                selectedElements={selectedElement}
                onSelect={elements => setSelectedUser(elements)}
            />
    </div>
  )
}

export default SelectUser