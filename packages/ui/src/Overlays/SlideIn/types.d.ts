export type SlideInComponent = {
    children: React.ReactNode,
    header: string,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
	size?: 'small' | 'medium' | 'large',
	preventClickOutside?: boolean
}