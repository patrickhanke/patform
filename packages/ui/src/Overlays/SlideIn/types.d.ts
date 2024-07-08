export type SlideInComponent = {
    children: React.ReactNode,
    header: string,
    isOpen: boolean,
    close: () => void,
	size?: 'small' | 'medium' | 'large',
	preventClickOutside?: boolean,
    secondaryContent?: React.ReactNode | null
}

export type SlideInStoreProps = {
    isOpen: boolean,
    content?: React.FC | null,
    secondaryContent?: React.FC | null,
    closeSlideIn: () => void
    setContent: (content: React.FC) => void
    setSecondaryContent: (content: React.FC) => void
}