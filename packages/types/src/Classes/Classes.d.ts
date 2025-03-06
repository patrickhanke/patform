import { FormDataElement } from '@repo/ui';

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

export type PatstoreProject = {
    name: string,
    description: string,
    objectId: string,
    content: { label: string; value: string; icon: string; }[],
    logo: string,
    modules: {
        results: Module[]
        
    }
    settings: {}
}

export type ClassCategories = string[];

export type ClassState = {
    value: string,
    label: string,
    color: string
}

export type ClassProperties = {
    objectId: string,
    createdAt: string,
    data: FormDataElement,
    module: Module,
    categories: ClassCategories 
    label: string
}

export type Classes = ImageClass | NewsClass | PersonClass | CategoryClass | EventClass






