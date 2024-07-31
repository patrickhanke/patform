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
    tags: Category['objectId'][]
    categories: Categories
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

export type ModuleSettings = {
    categories: [{id: string, label: string, value: string, position: number }]
}

export type Categories = {
    [key: string]: string[]
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
    path: string,
    icon: string,
    fields: Field[],
    position: number,
    project: Project,
    connected_class: string,
    categories: ModuleCategory[],
    settings: ModuleSettings
}


export type Category = {
    objectId: string,
    name: string,
    image: string,
    createdAt: string,
    icon: string,
    connected_class: string,
    key: string,
    moduleId: string,
    description: string,
}