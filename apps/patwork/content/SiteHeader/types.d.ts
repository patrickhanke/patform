export type SiteHeaderButton = {
    text: string,
    onClick: () => void,
    is_add_button?: boolean,
    is_reset_button?: boolean,
    color?: string,
    disabled?: boolean,
}

export type SiteHeaderButtons = SiteHeaderButton[]

type SiteHeaderContent =  React.JSX.Element;

export type item = {
    value: string
    label: string,
    disabled?: boolean
}

export type items = item[]

export type SiteHeaderComponent = {
    title?: string, 
}

export type SiteNavigationComponent = {
    items: SiteHeaderComponent['navItems'],
    currentItem: SiteHeaderComponent['navCurrentItem'],
    onClick: SiteHeaderComponent['navOnClick']
}