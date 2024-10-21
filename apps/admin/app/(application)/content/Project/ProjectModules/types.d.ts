import {Module} from '@repo/types'
import { Dispatch, SetStateAction } from 'react'
import { module_option_fields } from './constants/module_option_fields'

export type SelectModule = {
    value: keyof typeof module_option_fields, 
    label: string,
    fields: module_option_fields[keyof typeof module_option_fields],
    disabled: boolean
} 

export type CreateModuleProps = {
    createModule: boolean,
    setCreateModule: Dispatch<SetStateAction<boolean>>,
    createModuleHandler: (T: SelectModule['fields']) => Promise<void> ,
    modules: Module[]
}