export type DnDItem = {
    id: string,
    label: string,
    id: string,
    position?: number,
    name?: string
    required?: boolean,
    is_page?:boolean
}

export type DnDItems =  Array<DnDItem>


export type DnD_Type = {
    items: DnDItemss,
    ItemComponent: React.FC<({item: DnDItem, id: DnDItem.id})>,
    objectClass: string,
    componentStyles?: (item: DnDItem) => object | null
}

export type Sortable_Type = {
    id: DnDItem.id,
    item: DnDItem,
    ItemComponent: React.FC<({item: DnDItem, id: DnDItem.id})>,
    componentStyles?: (item: DnDItem) => object | null
}