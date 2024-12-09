import { ErrorMessage } from '@/types';

export type SlideInComponent = {
    children: React.ReactNode,
    header: string,
    isOpen: boolean,
    cancel: () => void,
    confirm: () => void,
	size?: 'small' | 'medium' | 'large',
	preventClickOutside?: boolean,
    secondaryContent?: React.ReactNode | null,
    disabled?: [boolean, boolean],
    errors?: ErrorMessage[],
    confirmText?: string
}

export type SlideInStoreProps = {
    isOpen: boolean,
    content?: React.FC | null,
    secondaryContent?: React.FC | null,
    closeSlideIn: () => void
    setContent: (content: React.FC) => void
    setSecondaryContent: (content: React.FC) => void
}

export type SecondaryContentWrapperProps = {
    isOpen: boolean,
    children: React.ReactNode
}