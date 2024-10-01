import { Field } from '@repo/ui';
import { Project } from './Classes';

export type ModuleCategory = {
    id: string,
    moduleId: string,
    label: string,
    key: string,
    connected_class: string,
    position: number,
    is_multi: boolean
}

export type ModuleSettings = {
    [key: string] : any,
    categories: [{id: string, label: string, value: string, position: number }]
}

export type Module = {
    objectId: string,
    name: string,
    path: string,
    icon: string,
    fields: Field[],
    position: number,
    project: Project,
    connected_class: string,
    categories: ModuleCategory[],
    settings: ModuleSettings
}