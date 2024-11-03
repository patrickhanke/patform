import { useCallback } from 'react';
import { AppModuleEditFieldProps } from '../types'
import { slugify } from '@repo/provider';
import { InfoBox, Select, StatelessToggle } from '@repo/ui';
import fieldTypes from '../constants/fieldTypes';
import { Field } from '@repo/ui';

const AppModuleEditField = ({field, setFields}: AppModuleEditFieldProps) => {

    if (!field) {
        return null
    }  

    const changeHandler = useCallback((key: keyof Field, value: Field[keyof Field]) => {
        setFields(draft => {
            const index: number = draft.findIndex((fieldToFind: Field) => fieldToFind.id === field.id)
            let fieldCopy: typeof field = {...field}
            if (index !== -1) {
                draft[index] = {...fieldCopy, [key]: value}
            }
        })
    }, [field, setFields])

    return (
        <div>
            <h3>{field.label}</h3>
            <div>
                <label>Label</label>
                <input type='text' defaultValue={field.label} onChange={(e) => changeHandler('label', e.target.value)} />
                <p>
                    {slugify(field.label)}
                </p>
            </div>
            <div>
                <label>Name</label>
                <input type='text' defaultValue={field.label} onChange={(e) => changeHandler('name', e.target.value)} />
                <InfoBox text='Pfadname des Felds' />
            </div>
            <div>
                <Select
                    label='Typ auswählen'
                    options={fieldTypes}
                    value={field.type}
                    onChange={(e) => changeHandler('type', e.value)}
                />
            </div>
            <div>
                <label>
                    Pflichtfeld
                </label>
                <input 
                    type='text' 
                    defaultValue={field.validation?.required} 
                    onChange={(e) => changeHandler('name', e.target.value)} 
                />
            </div>
            {field.type === 'number' && (
                <div>
                    <label>Startwert</label>
                    <input 
                        type='number' 
                        defaultValue={field.options?.number_start_value} 
                        onChange={(e) => changeHandler('options', {number_start_value: parseInt(e.target.value), number_end_value: field.options?.number_end_value})} 
                    />
                    <label>Endwert</label>
                    <input 
                        type='number' 
                        defaultValue={field.options?.number_end_value} 
                        onChange={(e) => changeHandler('options', {number_start_value: field.options?.number_start_value, number_end_value: parseInt(e.target.value)})} 
                    />
                </div>

            )}
        </div>
    )
}

export default AppModuleEditField