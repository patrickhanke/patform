export type IconType = 'delete' | 'edit' | 'cancel' | 'save' | 'arrow' | 'download' | 'view' | 'email' | 'message' | 'settings' | 'check' | 'copy' | 'info' | 'link' | 'change' | 'grid' | 'text' | 'chart' | 'page'

export type IconButton = {
    icon: IconType,
    isLink?: boolean,
    isDarkButton?: boolean,
    onClick?: () => void,
    disabled?: boolean,
    link?: string,
    isBlank?: boolean,
    text?: string
}