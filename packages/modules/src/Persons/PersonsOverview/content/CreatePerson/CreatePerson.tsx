import { useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { Field, IconButton, SlideIn } from '@repo/ui'
import { AppContext, useDataHandler } from '@repo/provider'
import { Form } from '@repo/ui'

const CreatePerson = () => {
    const {createData}  = useDataHandler()
    const {currentModule} = useContext(AppContext) 
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState({} as {[key: string]: any})

   
    const [disabled, setDisabled] = useState([false, false])
   
    const personFields = useMemo(() => {
        const constantFields: Field[] = [{
            id: 'name',
            position: 1,
            name: 'name',
            type: 'input',
            label: 'Name',
            validation: 'string_required'
        },
        {
            id: 'portrait',
            position: 2,
            name: 'portrait',
            type: 'image',
            label: 'Portrait',
            options: {
                return_type: 'string',
                max_file_count: 1
            }
        }] as const;
    

        if (currentModule.fields) {
            currentModule.fields.forEach(field => {
                if (field.name) {
                    constantFields.push({...field, path: '/data'})
                }
            })
        }
        const initialData = {
        name: '',
        portrait: '',
        data: currentModule.fields.reduce((acc: {[key: string]: string}, field) => { 
            acc[field.name.slice(field.name.lastIndexOf('.') + 1) as keyof Field] = field.initialValue
            return acc
        } , {})
    }

        return {constantFields, initialData};
    }, [currentModule.fields])

    useEffect(() => {
        if (personFields.initialData && !data) {
            setData(personFields.initialData)
        }
    }, [personFields.initialData])

    console.log(currentModule);
    console.log(data);

    const dataHandler = useCallback(async () => {
        setDisabled([true, true])
        await createData({
            className: 'Person',
            updateObject: {
                module: {__type: 'Pointer', className: 'Module', objectId: currentModule.objectId},
                ...data
            }
        })
        setDisabled([false, false])
        setIsOpen(false)

    }, [data])


     return (
        <>
            
            <button
                onClick={() => setIsOpen(true)}
                disabled={false}
                className='button md primary'
            >
                Person erstellen
            </button>
            <SlideIn 
                isOpen={isOpen} 
                header='Person erstellen' 
                cancel={() => setIsOpen(false)} 
                confirm={() => dataHandler()}
                >
                    {personFields.constantFields && data &&
                        <Form
                            fields={personFields.constantFields} 
                            data={data} 
                            formSubmitHandler={values => {setData( values)}} 
                        />
                    }
            </SlideIn>
        </>
    )
}

export default CreatePerson;