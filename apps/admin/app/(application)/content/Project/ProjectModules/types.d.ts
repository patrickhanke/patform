import Module from '@repo/types'
import { Dispatch, SetStateAction } from 'react'

export type SelectModule = {
    value: string, 
    label: string,
    fields: Module
} 

export type CreateModuleProps = {
    createModule: boolean,
    setCreateModule: Dispatch<SetStateAction<boolean>>,
    createModuleHandler: (T: SelectModule['fields']) => Promise<void> ,
    modules: Module[]
}