export type item = {
    value: string
    label: string
}

export type items = item[]

export type SiteNavigation = {
    items,
    currentItem: item,
    onClick: (item) => void
}