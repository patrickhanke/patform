import { useCallback, useState } from 'react';
import { AppModuleEditFieldProps } from '../types'
import { slugify } from '@repo/provider';
import { Select, StatelessToggle, SwitchButtons } from '@repo/ui';
import fieldTypes from '../constants/fieldTypes';
import { Field } from '@repo/types';

const AppModuleEditField = ({field, setFields}: AppModuleEditFieldProps) => {

    if (!field) {
        return null
    }  

    const changeHandler = useCallback((key: keyof Field, value: Field[keyof typeof field]) => {
        setFields(draft => {
            const index: number = draft.findIndex(fieldToFind => fieldToFind.id === field.id)
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
                <Select
                    label='Typ auswählen'
                    options={fieldTypes}
                    value={field.type}
                    onChange={(e) => changeHandler('type', e.value)}
                />
            </div>
            <div>
                <StatelessToggle
                    label='Feld ist Pflichtfeld'
                    value={field.required}
                    onChange={(e) => changeHandler('required', e)}
                />
            </div>
            {field.type === 'number' && (
                <div>
                    <label>Startwert</label>
                    <input type='number' defaultValue={field.options?.number_start_value} onChange={(e) => changeHandler('options', {number_start_value: parseInt(e.target.value), number_end_value: field.options?.number_end_value})} />
                    <label>Endwert</label>
                    <input type='number' defaultValue={field.options?.number_end_value} onChange={(e) => changeHandler('options', {number_start_value: field.options?.number_start_value, number_end_value: parseInt(e.target.value)})} />
                </div>

            )}
        </div>
    )
}

export default AppModuleEditField