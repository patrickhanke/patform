import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Divider, ImageUploader, SlideIn, TextInput } from '@repo/ui'
import { UserSettingsProps } from '../types';
import { ErrorMessage, PatstoreUser } from '@repo/types';
import { useDataHandler } from '@repo/provider';
import ProjectSelection from './ProjectSelection';
import * as yup from 'yup';

const UserSettings: FC<UserSettingsProps> = ({user, userSettings, setUserSettings, getUser}) => {
    const {updateData} = useDataHandler()
    const [data, setData] = useState<PatstoreUser>(user)
    const [password, setPassword] = useState({
        password: '',
        confirm_password: ''
    })
    const [loading, setLoading] = useState(false)


    const dataValidation = useMemo(() => {
        const errorArray: ErrorMessage[] = []
        let schema = yup.object().shape({
            username: yup.string().required(),
            email: yup.string().email().required(),
        });
        schema.validate(data).catch((errors) => {
            errorArray.push({message: errors.errors[0], id: errors.path, key: errors.path})
        })

        return errorArray
    }, [data])

    const passwordValidation =  useMemo(() => {
        const errorArray: ErrorMessage[] = []
        if (password.password) {
            if (password.password.length < 8) {
                errorArray.push({message: 'Passwort muss mindestens 8 Zeichen lang sein', id: 'password_length', key: 'password_length'})
            }
            if (!/[0-9]/.test(password.password)) {
                errorArray.push({message: 'Passwort muss eine Zahl enthalten', id: 'password_number', key: 'password_number'})
            }
            if (!/[a-z]/.test(password.password)) {
                errorArray.push({message: 'Passwort muss einen Kleinbuchstaben enthalten', id: 'password_lowercase', key: 'password_lowercase'})
            }
            if (!/[A-Z]/.test(password.password)) {
                errorArray.push({message: 'Passwort muss einen Großbuchstaben enthalten', id: 'password_uppercase', key: 'password_uppercase'})
            }
            if (!/[^\w]/.test(password.password)) {
                errorArray.push({message: 'Passwort muss ein Sonderzeichen enthalten', id: 'password_symbol', key: 'password_symbol'})
            }
        }

        if (errorArray.length === 0) {
            if (password.confirm_password !== password.password) {
                errorArray.push({message: 'Passwörter stimmen nicht überein', id: 'password_match', key: 'password_match'})
            }
        }
        return errorArray
         
    }, [password])

    const updateObject = useMemo(() => {
        let updatedata;
        if (passwordValidation.length > 0 && dataValidation.length > 0) {
            return
        }

        if (user.email !== data.email) {
            updatedata = {
                email: data.email
            }
        }
        if (user.username !== data.username) {
            updatedata = {
                ...updatedata,
                username: data.username
            }
        }
        if (user.portrait !== data.portrait) {
            updatedata = {
                ...updatedata,
                portrait: data.portrait
            }
        }
        if (password.password && password.confirm_password) {
            updatedata = {
                ...updatedata,
                password: password.password
            }
        }
        return updatedata

    }, [data, passwordValidation, dataValidation, password])

    const updateUserData = useCallback(async() => {
        setLoading(true)

        await updateData({
            className: '_User',
            objectId: data.objectId,
            updateObject

            })
            .then(() => {
                console.log('User data updated');
            })
        await getUser()
        setLoading(false)
        setUserSettings(false)
    }, [data, updateObject])
    
    return (
        <SlideIn
            header='Nutzereinstellungen'
            isOpen={userSettings}
            cancel={() => setUserSettings(false)}
            confirm={() => updateUserData()}
            preventClickOutside
            disabled={[loading, loading || !updateObject || passwordValidation.length > 0 || dataValidation.length > 0]}
            errors={[...passwordValidation, ...dataValidation]}
        >
            <div>
                <TextInput
                    defaultValue={data.username}
                    label='Nutzername'
                    id='label'
                    onChange={(value) => setData({...data, username: value})}
                />
                <TextInput
                    defaultValue={data.email}
                    label='E-Mail'
                    id='username'
                    onChange={(value) => setData({...data, email: value})}
                />
                <ImageUploader
                    path='users'
                    label='Profilbild'
                    onChange={(value) => setData({...data, portrait: value.length > 0 ? value[0] : ''})}
                    maxFileCount={1}// v
                    previewImage={data.portrait}
                    crop
                    preview
                />
                <Divider size='small' />
                <ProjectSelection projects={data.projects} />
                <Divider size='small' />
                <TextInput
                    defaultValue={''}
                    label='Passwort'
                    id='password'
                    type='password'
                    onChange={(value) => setPassword({...password, password: value})}
                />
                <TextInput
                    defaultValue={''}
                    label='Passwort bestätigen'
                    id='confirm_password'
                    type='password'
                    onChange={(value) => setPassword({...password, confirm_password: value})}
                />
            </div>
        </SlideIn>
  )
}

export default UserSettings