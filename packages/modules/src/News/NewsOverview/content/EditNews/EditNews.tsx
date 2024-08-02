import { useCallback, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { IconButton, SlideIn } from '@repo/ui'
import { News } from '@repo/types'
import { AppContext, generateGraphQLQuery, useDataHandler } from '@repo/provider'
import { Form } from '@repo/ui'

const EditNews = ({newsId}: {newsId: string}) => {
    const {updateData}  = useDataHandler()
    const {currentModule} = useContext(AppContext) 
    const [data, setData] = useState(null as unknown as News['data'])
    const [isOpen, setIsOpen] = useState(false)
    const { loading, refetch } = useQuery(generateGraphQLQuery({
        type: 'get', 
        objectName: 'News', 
        fields: ['objectId', 'title', 'image', 'createdAt', 'text', 'data'] 
    } ), {
        variables: { id: newsId },
        onCompleted: data => {  
            console.log(data);
            setData(data.objects.getNews.data)
        },
        skip: !isOpen
    })
    const [disabled, setDisabled] = useState([false, false])
   
    const dataHandler = useCallback(async () => {
        setDisabled([true, true])
        await updateData({
            objectId: newsId,
            className: 'News',
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
                header='News bearbeiten' 
                cancel={() => setIsOpen(false)} 
                confirm={() => dataHandler()}
                >
                    {currentModule.fields && <Form fields={currentModule.fields} data={data} formSubmitHandler={values => setData(values)} />}
            </SlideIn>
        </>
    )
}

export default EditNews