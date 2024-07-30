import { Field, FormDataElement } from '@repo/ui';

export type Project = {
    name: string,
    objectId: string,
    content: { label: string; value: string; icon: string; }[],
    logo: {
        name: string, 
        url: string
    },
    modules: {
        results: Module[]
        
    }
}

export type Image = {
    objectId: string,
    name: string,
    filePath: string,
    description: string, 
    persons: string[],
    tags: Category['objectId'][]
}

export type ModuleCategory = {
    id: string,
    moduleId: string,
    label: string,
    key: string,
    connected_class: string,
    position: number,
    is_multi: boolean
}

export type Category = {
    objectId: string,
    name: string,
    type: string,
}

export type Person = {
    data: FormDataElement,
    objectId: string,
    name: string,
    createdAt: string,
    portrait: string
}

export type Module = {
    objectId: string,
    name: string,
    title: string,
    path: string,
    icon: string,
    settings: object,
    fields: Field[],
    position: number,
    project: Project,
    connected_class: string,
    categories: ModuleCategory[]
}
