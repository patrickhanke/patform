import { useCallback, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { IconButton, SlideIn } from '@repo/ui'
import { Person } from '@repo/types'
import { AppContext, generateGraphQLQuery, useDataHandler } from '@repo/provider'
import { Form } from '@repo/ui'

const EditCategory = ({personId}: {personId: string}) => {
    const {updateData}  = useDataHandler()
    const {currentModule} = useContext(AppContext) 
    const [data, setData] = useState(null as unknown as Person['data'])
    const [isOpen, setIsOpen] = useState(false)
    const { loading, refetch } = useQuery(generateGraphQLQuery({type: 'get', objectName: 'Person', fields:  ['objectId', 'name', 'portrait', 'data']} ), {
        variables: { id: personId },
        onCompleted: data => {  
            console.log(data);
            
            setData(data.objects.getPerson.data)
        },
        skip: !isOpen
    })
    const [disabled, setDisabled] = useState([false, false])
   
    const dataHandler = useCallback(async () => {
        setDisabled([true, true])
        await updateData({
            objectId: personId,
            className: 'Person',
            updateObject: {
                data
            }

        })
        setDisabled([false, false])
        setIsOpen(false)

    }, [data])

    useEffect(() => {
        if (isOpen) {
            refetch()
        }
    }, [isOpen])

    return (
        <>
            <IconButton
                icon='edit'
                onClick={() => setIsOpen(true)}
                disabled={loading}
            />
            <SlideIn 
                isOpen={isOpen} 
                header='Person bearbeiten' 
                cancel={() => setIsOpen(false)} 
                confirm={() => dataHandler()}
                >
                    {currentModule.fields && <Form fields={currentModule.fields} data={data} formSubmitHandler={values => setData(values)} />}
            </SlideIn>
        </>
    )
}

export default EditCategory;