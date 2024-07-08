import React, { useCallback, useState } from 'react'
import { useQuery } from '@apollo/client'
import get_person from '../constants/get_person'
import { IconButton, SlideIn } from '@repo/ui'
import { Person } from '@repo/types'

const EditPerson = ({personId}: {personId: string}) => {
    const { data, loading, error } = useQuery(get_person, {
        variables: { id: personId }
    })
    const [isOpen, setIsOpen] = useState(false)
    const [someContent, setSomeContent] = useState(null as unknown as React.ReactNode | null)
    const [person, setPerson] = useState(null as unknown as Person)

    const someContentHandler = useCallback(() => {
        if (someContent === null) {
            return setSomeContent(<p>Some Content</p> as React.ReactNode)
        }else {
            setSomeContent(null)
        }
    },[someContent])

  return (
    <>
        <IconButton
            icon='edit'
            onClick={() => setIsOpen(true)}
        />
        <SlideIn 
            isOpen={isOpen} 
            header='Person bearbeiten' 
            close={() => setIsOpen(false)} 
            secondaryContent={someContent} 
            >
                <div onClick={() => someContentHandler()}>
                    <h1>Edit Person</h1>
                    <p>{data?.objects.getPerson.name}</p>
                
                </div>
        </SlideIn>
    </>
  )
}

export default EditPerson