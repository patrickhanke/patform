import { FC, useMemo } from 'react'
import { Field, Form } from '@repo/ui'
import { CreateUserProps, UserObject } from '../types'

const CreateUser: FC<CreateUserProps> = ({user, setUser}) => {

    const formFields = useMemo(() => [
        {
			label: `E-Mail Adresse`,
            id: 'username',
            name: 'username',
            type: 'input',
			value: user.username,
            placeholder: 'beispiel@email.de'
		} as Field,{
            label: `Benutzername`,
            name: 'userlabel',
            type: 'input',
            value: user.username,
            dataType: 'string',
            placeholder: 'Vor- und Nachname',
        }
    ], [user])

    return (
        <div>
            <Form 
                fields={formFields as Field[]}
                data={user}
                afterSaveFunction={(data) => {
                    setUser(data as UserObject)
                }}
            />
            <label>
                Passwort
            </label>
            <div className='content_element'>
                
            </div>
        </div>
    )
}

export default CreateUser