import { Field, FormDataElement } from '@repo/ui';

export type Category = {
    objectId: string,
    type: string,
    name: string,
    data: object,
    module: Module,
    image: string
}

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

export type ClassCategories = string[];

export type ClassProperties = {
    objectId: string,
    createdAt: string,
    data: FormDataElement,
    module: Module,
    categories: ClassCategories 
}

export type ImageClass = ClassProperties & {
    name: string,
    filePath: string,
}

export type PersonClass = ClassProperties & {
    name: string,
    portrait: string
}

export type CategoryClass = ClassProperties & {
    name: string,
    image: string,
    icon: string,
    connected_class: string,
    key: string,
    description: string,
}

export type NewsClass = ClassProperties & {
    title: string,
    image: string,
    text: string,
    autor: string,
}

export type Classes = ImageClass | NewsClass | PersonClass | CategoryClass

export type Person ={
    objectId: string,
    name: string,
    portrait?: string,
    data: FormDataElement,
    module: Module,
    content: object
}

export type Image = {
    createdAt: string,
    objectId: string,
    name: string,
    tags: string[],
    filePath: string,
    data: FormDataElement,
    module: Module,
    content: object,
    categories: ClassCategories,
    description: string
}


