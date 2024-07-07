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
