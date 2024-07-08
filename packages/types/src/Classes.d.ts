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

export type Category = {
    objectId: string,
    name: string,
    type: string,
}

export type Person = {
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
    fields: object[]
}
