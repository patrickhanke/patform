export type IconButton = {
    icon: iconType,
    isLink?: boolean,
    isDarkButton?: boolean,
    onClick?: () => void,
    disabled?: boolean,
    link?: Url,
    isBlank?: boolean,
    text?: string
}