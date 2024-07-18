import { useCallback, useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { IconButton, SlideIn } from '@repo/ui'
import { Person } from '@repo/types'
import { AppContext, generateGraphQLQuery, useDataHandler } from '@repo/provider'
import { Form } from '@repo/ui'

const EditPerson = ({personId}: {personId: string}) => {
    const {updateData}  = useDataHandler()
    const {currentModule} = useContext(AppContext) 
    const [data, setData] = useState(null as unknown as Person['data'])
    const [isOpen, setIsOpen] = useState(false)
    const { loading } = useQuery(generateGraphQLQuery('getPerson', ['objectId', 'name', 'portrait', 'data', 'blupp'] ), {
        variables: { id: personId },
        onCompleted: data => {  
            setData(data.object.getPerson)
        },
        skip: !isOpen
    })
    const [disabled, setDisabled] = useState([false, false])
   
    console.log(currentModule);

    const dataHandler = useCallback(async () => {
        setDisabled([true, true])
        await updateData({
            objectId: personId,
            className: 'Person',
            updateObject: {
                ...data
            }

        })
        setDisabled([false, false])
        setIsOpen(false)

    }, [data])

    console.log(data);
    
   
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

export default EditPerson